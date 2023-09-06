import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { Either, right } from '@/core/either';

interface FetchQuestionCommentRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>;

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentRequest): Promise<FetchQuestionCommentResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
