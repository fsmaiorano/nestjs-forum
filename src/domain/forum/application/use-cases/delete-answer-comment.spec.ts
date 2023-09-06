import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase;

beforeEach(() => {
  inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

  deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
    inMemoryAnswerCommentRepository,
  );
});

describe('DeleteAnswerCommentUseCase', () => {
  test('should be able delete an answer comment', async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentRepository.create(answerComment);

    await deleteAnswerCommentUseCase.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0);
  });

  test('should not be able delete an answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-id'),
    });

    await inMemoryAnswerCommentRepository.create(answerComment);

    const result = await deleteAnswerCommentUseCase.execute({
      authorId: 'invalid-author-id',
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
