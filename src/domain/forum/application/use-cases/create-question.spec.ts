import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let createQuestionUseCase: CreateQuestionUseCase;

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );
  createQuestionUseCase = new CreateQuestionUseCase(inMemoryQuestionRepository);
});

describe('CreateQuestionUseCase', () => {
  test('should create an Question', async () => {
    const result = await createQuestionUseCase.execute({
      authorId: '1',
      title: 'new response',
      content: 'new response',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        attachmentId: expect.objectContaining({ value: '1' }),
      }),
      expect.objectContaining({
        attachmentId: expect.objectContaining({ value: '2' }),
      }),
    ]);
  });
});
