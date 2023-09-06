import { InMemoryAnswerAttachmentRepository } from './../../../../../test/repositories/in-memory-answer-attachment-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from './../../../../../test/repositories/in-memory-answer-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let deleteAnswerUseCase: DeleteAnswerUseCase;

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository,
  );
  deleteAnswerUseCase = new DeleteAnswerUseCase(inMemoryAnswerRepository);
});

describe('DeleteAnswerUseCase', () => {
  test('should be able delete an answer', async () => {
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

    await deleteAnswerUseCase.execute({
      authorId: newAnswer.authorId,
      answerId: '123',
    });

    expect(inMemoryAnswerRepository.items.length).toBe(0);
    expect(inMemoryAnswerAttachmentRepository.items.length).toBe(0);
  });

  test('should not be able delete an answer with invalid authorId', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id').toString(),
      },
      new UniqueEntityId('123'),
    );

    inMemoryAnswerRepository.create(newAnswer);

    const result = await deleteAnswerUseCase.execute({
      authorId: 'invalid-author-id',
      answerId: '123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
