import { Either, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerRepository } from '../repositories/answer-respository';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';

interface AnswerQuestionRequest {
  instructorId: string;
  questionId: string;
  attachmentsIds?: string[];
  content: string;
}

type AnswerQuestionResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    attachmentsIds,
    content,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      authorId: instructorId,
      questionId,
      content,
    });

    const answerAttachments = attachmentsIds?.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    if (answerAttachments) {
      answer.attachments = new AnswerAttachmentList(answerAttachments);
    }

    await this.answerRepository.create(answer);

    return right({ answer });
  }
}
