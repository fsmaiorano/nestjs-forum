import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionRepository } from './../../../../../test/repositories/in-memory-question-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase;

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository();
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
  );
  getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
    inMemoryQuestionRepository,
  );
});

describe('GetQuestionBySlugUseCase', () => {
  test('should be able find an question by slug', async () => {
    const newQuestion = makeQuestion({ title: 'my new question' });

    inMemoryQuestionRepository.create(newQuestion);

    const result = await getQuestionBySlugUseCase.execute({
      slug: 'my-new-question',
    });

    expect(result.value?.question.id).toBeTruthy();
    expect(result.value?.question.title).toEqual(newQuestion.title);
  });
});
