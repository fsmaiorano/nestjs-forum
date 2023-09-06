import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { InMemoryAnswerRepository } from './../../../../../test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase;

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository,
  );
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );

  chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
    inMemoryQuestionRepository,
    inMemoryAnswerRepository,
  );
});

describe('ChooseQuestionBestAnswerUseCase', () => {
  test('should be able delete an answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id.toString() });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    await chooseQuestionBestAnswerUseCase.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  test('should not be able delete an answer with invalid authorId', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({}, question.id);

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    const result = await chooseQuestionBestAnswerUseCase.execute({
      answerId: '999',
      authorId: question.authorId.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
