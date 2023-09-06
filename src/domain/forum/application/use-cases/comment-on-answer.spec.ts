import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';

let inMemoryQuestionCommentrRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let commentOnAnswerUseCase: CommentOnAnswerUseCase;

beforeEach(() => {
  inMemoryQuestionCommentrRepository = new InMemoryQuestionCommentRepository();
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );

  commentOnAnswerUseCase = new CommentOnAnswerUseCase(
    inMemoryQuestionRepository,
    inMemoryQuestionCommentrRepository,
  );
});

describe('CommentOnAnswerUseCase', () => {
  test('should be able comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionRepository.create(question);

    await commentOnAnswerUseCase.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'test content',
    });

    expect(inMemoryQuestionCommentrRepository.items[0].content).toEqual(
      'test content',
    );
  });
});
