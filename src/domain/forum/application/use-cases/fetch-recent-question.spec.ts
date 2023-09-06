import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { FetchRecentQuestionUseCase } from './fetch-recent-question';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let fetchRecentQuestionUseCase: FetchRecentQuestionUseCase;

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );
  fetchRecentQuestionUseCase = new FetchRecentQuestionUseCase(
    inMemoryQuestionRepository,
  );
});

describe('FetchRecentQuestionUseCase', () => {
  test('should be able fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionRepository.create(makeQuestion());
    }

    const result = await fetchRecentQuestionUseCase.execute({
      page: 2,
    });

    expect(result.value?.questions.length).toBe(2);
  });

  test('should be able fetch recent questions', async () => {
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2022,01,01') }),
    );
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2021,01,01') }),
    );
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2020,01,01') }),
    );

    const result = await fetchRecentQuestionUseCase.execute({
      page: 1,
    });

    expect(result.value?.questions.length).toBe(3);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date('2022,01,01') }),
      expect.objectContaining({ createdAt: new Date('2021,01,01') }),
      expect.objectContaining({ createdAt: new Date('2020,01,01') }),
    ]);
  });
});
