import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { Either, right } from '@/core/either';

interface FetchAnswerCommentRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentResponse = Either<
  null,
  { answerComments: AnswerComment[] }
>;

export class FetchAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentRequest): Promise<FetchAnswerCommentResponse> {
    const answerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({ answerComments });
  }
}
