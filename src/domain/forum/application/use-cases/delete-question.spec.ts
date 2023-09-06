import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { DeleteQuestionUseCase } from './delete-question';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let deleteQuestionUseCase: DeleteQuestionUseCase;

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );
  deleteQuestionUseCase = new DeleteQuestionUseCase(inMemoryQuestionRepository);
});

describe('DeleteQuestionUseCase', () => {
  test('should be able delete an question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId('123'));

    inMemoryQuestionRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    await deleteQuestionUseCase.execute({
      authorId: newQuestion.authorId,
      questionId: '123',
    });

    expect(inMemoryQuestionRepository.items.length).toBe(0);
    expect(inMemoryQuestionAttachmentRepository.items.length).toBe(0);
  });

  test('should not be able delete an question with invalid authorId', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id').toString(),
      },
      new UniqueEntityId('123'),
    );

    inMemoryQuestionRepository.create(newQuestion);

    const result = await deleteQuestionUseCase.execute({
      authorId: 'invalid-author-id',
      questionId: '123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionAttachmentRepository.items.length).toBe(0);
  });
});
