import { FetchQuestionCommentUseCase } from './fetch-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let fetchQuestionCommentUseCase: FetchQuestionCommentUseCase;

beforeEach(() => {
  inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
  fetchQuestionCommentUseCase = new FetchQuestionCommentUseCase(
    inMemoryQuestionCommentRepository,
  );
});

describe('FetchQuestionCommentUseCase', () => {
  test('should be able fetch paginated comment of an question', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
        }),
      );
    }

    const result = await fetchQuestionCommentUseCase.execute({
      questionId: new UniqueEntityId('question-1').toString(),
      page: 2,
    });

    expect(result.value?.questionComments.length).toBe(2);
  });

  test('should be able fetch comment of an question', async () => {
    inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    );
    inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    );
    inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    );

    const result = await fetchQuestionCommentUseCase.execute({
      questionId: new UniqueEntityId('question-1').toString(),
      page: 1,
    });

    expect(result.value?.questionComments.length).toBe(3);
  });
});
