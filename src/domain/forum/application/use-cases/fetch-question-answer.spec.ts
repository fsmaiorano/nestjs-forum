import { FetchQuestionAnswerUseCase } from './fetch-question-answer';
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let fetchQuestionAnswerUseCase: FetchQuestionAnswerUseCase;

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository,
  );
  fetchQuestionAnswerUseCase = new FetchQuestionAnswerUseCase(
    inMemoryAnswerRepository,
  );
});

describe('FetchQuestionAnswerUseCase', () => {
  test('should be able fetch paginated answers of an question', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1').toString() }),
      );
    }

    const result = await fetchQuestionAnswerUseCase.execute({
      questionId: new UniqueEntityId('question-1').toString(),
      page: 2,
    });

    expect(result.value?.answers.length).toBe(2);
  });

  test('should be able fetch answers of an question', async () => {
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1').toString() }),
    );
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1').toString() }),
    );
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1').toString() }),
    );

    const result = await fetchQuestionAnswerUseCase.execute({
      questionId: new UniqueEntityId('question-1').toString(),
      page: 1,
    });

    expect(result.value?.answers.length).toBe(3);
    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('question-1').toString(),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('question-1').toString(),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('question-1').toString(),
      }),
    ]);
  });
});
