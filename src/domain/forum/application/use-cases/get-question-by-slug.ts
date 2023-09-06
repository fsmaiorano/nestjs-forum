import { Either, right } from '@/core/either';
import { QuestionRepository } from '../repositories/question-repository';
import { Question } from './../../enterprise/entities/question';

interface GetQuestionBySlugRequest {
  slug: string;
}

type GetQuestionBySlugResponse = Either<null, { question: Question }>;

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (question === null) {
      throw new Error(`Question with slug: ${slug} not found`);
    }

    return right({ question });
  }
}
