import { Either, right } from '@/core/either';
import { QuestionRepository } from '../repositories/question-repository';
import { Question } from './../../enterprise/entities/question';

interface FetchRecentQuestionRequest {
  page: number;
}

type FetchRecentQuestionResponse = Either<null, { questions: Question[] }>;

export class FetchRecentQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionRequest): Promise<FetchRecentQuestionResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({ questions });
  }
}
