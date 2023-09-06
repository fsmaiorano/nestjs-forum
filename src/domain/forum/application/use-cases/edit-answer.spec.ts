import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from './../../../../../test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let editAnswerUseCase: EditAnswerUseCase;

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository,
  );
  editAnswerUseCase = new EditAnswerUseCase(
    inMemoryAnswerRepository,
    inMemoryAnswerAttachmentRepository,
  );
});

describe('EditAnswerUseCase', () => {
  test('should be able update an answer', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityId('123'));

    inMemoryAnswerRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    await editAnswerUseCase.execute({
      authorId: newAnswer.authorId,
      answerId: '123',
      content: 'new edited content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'new edited content',
    });
  });

  test('should not be able update an answer with invalid authorId', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityId('123'));

    inMemoryAnswerRepository.create(newAnswer);

    const result = await editAnswerUseCase.execute({
      authorId: newAnswer.authorId,
      answerId: '999',
      content: 'new edited content',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
