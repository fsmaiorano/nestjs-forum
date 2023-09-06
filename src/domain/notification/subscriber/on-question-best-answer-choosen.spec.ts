import { SendNotificationUseCase } from './../application/use-cases/send-notification';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { makeQuestion } from 'test/factories/make-question';
import { SpyInstance, vi } from 'vitest';
import { OnQuestionBestAnswerChoosen } from './on-question-best-answer-choosen';
import { waitFor } from 'test/utils/wait-for';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let notificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance;

describe('OnQuestionBestAnswerChoosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    notificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnQuestionBestAnswerChoosen(
      inMemoryAnswerRepository,
      sendNotificationUseCase,
    );
  });

  it('should send a notification when a new best answer has been choosen', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id.toString() });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
