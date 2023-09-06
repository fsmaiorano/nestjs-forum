import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerRepository } from '../repositories/answer-respository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';

interface EditAnswerRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds?: string[];
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    attachmentsIds,
    content,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds?.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    if (answerAttachments) {
      answerAttachmentList.update(answerAttachments);
    }

    answer.content = content;
    answer.attachments = answerAttachmentList;

    answer.content = content;

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
