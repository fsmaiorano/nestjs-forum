import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionCommentrRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let commentOnQuestionUseCase: CommentOnQuestionUseCase;

beforeEach(() => {
  inMemoryQuestionCommentrRepository = new InMemoryQuestionCommentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );

  commentOnQuestionUseCase = new CommentOnQuestionUseCase(
    inMemoryQuestionRepository,
    inMemoryQuestionCommentrRepository,
  );
});

describe('CommentOnQuestionUseCase', () => {
  test('should be able comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionRepository.create(question);

    await commentOnQuestionUseCase.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'test content',
    });

    expect(inMemoryQuestionCommentrRepository.items[0].content).toEqual(
      'test content',
    );
  });
});
