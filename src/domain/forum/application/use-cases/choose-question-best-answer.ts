import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { AnswerRepository } from '../repositories/answer-respository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';

interface ChooseQuestionBestAnswerRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(answer.questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId.toString() !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
