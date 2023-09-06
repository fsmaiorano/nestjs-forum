import { Either, left, right } from '@/core/either';
import { AnswerRepository } from '../repositories/answer-respository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';

interface DeleteAnswerRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerRepository.delete(answer);

    return right(null);
  }
}
