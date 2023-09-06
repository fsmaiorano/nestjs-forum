import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let editQuestionUseCase: EditQuestionUseCase;

beforeEach(() => {
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  editQuestionUseCase = new EditQuestionUseCase(
    inMemoryQuestionRepository,
    inMemoryQuestionAttachmentRepository,
  );
});

describe('EditQuestionUseCase', () => {
  test('should be able update an question', async () => {
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

    await editQuestionUseCase.execute({
      authorId: newQuestion.authorId,
      questionId: '123',
      title: 'new edited title',
      content: 'new edited content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'new edited title',
      content: 'new edited content',
    });
  });

  test('should not be able update an question with invalid authorId', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId('123'));

    inMemoryQuestionRepository.create(newQuestion);

    const result = await editQuestionUseCase.execute({
      authorId: newQuestion.authorId,
      questionId: '999',
      title: 'new edited title',
      content: 'new edited content',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
