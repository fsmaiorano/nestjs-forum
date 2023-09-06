import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase;

beforeEach(() => {
  inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();

  deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
    inMemoryQuestionCommentRepository,
  );
});

describe('DeleteQuestionCommentUseCase', () => {
  test('should be able delete an question comment', async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentRepository.create(questionComment);

    await deleteQuestionCommentUseCase.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentRepository.items.length).toBe(0);
  });

  test('should not be able delete an question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-id'),
    });

    await inMemoryQuestionCommentRepository.create(questionComment);

    const result = await deleteQuestionCommentUseCase.execute({
      authorId: 'invalid-author-id',
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
