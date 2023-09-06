import { FetchAnswerCommentUseCase } from './fetch-answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let fetchAnswerCommentUseCase: FetchAnswerCommentUseCase;

beforeEach(() => {
  inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
  fetchAnswerCommentUseCase = new FetchAnswerCommentUseCase(
    inMemoryAnswerCommentRepository,
  );
});

describe('FetchAnswerCommentUseCase', () => {
  test('should be able fetch paginated comment of an answer', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
        }),
      );
    }

    const result = await fetchAnswerCommentUseCase.execute({
      answerId: new UniqueEntityId('answer-1').toString(),
      page: 2,
    });

    expect(result.value?.answerComments.length).toBe(2);
  });

  test('should be able fetch comment of an answer', async () => {
    inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    );
    inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    );
    inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    );

    const result = await fetchAnswerCommentUseCase.execute({
      answerId: new UniqueEntityId('answer-1').toString(),
      page: 1,
    });

    expect(result.value?.answerComments.length).toBe(3);
  });
});
