import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { AnswerQuestionUseCase } from './answer-question';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let answerQuestionUseCase: AnswerQuestionUseCase;

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository,
  );
  answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswerRepository);
});

describe('AnswerQuestionUseCase', () => {
  test('should create an Answer', async () => {
    const result = await answerQuestionUseCase.execute({
      instructorId: '1',
      questionId: '1',
      content: 'new response',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: expect.objectContaining({ value: '1' }),
      }),
      expect.objectContaining({
        attachmentId: expect.objectContaining({ value: '2' }),
      }),
    ]);
  });
});
