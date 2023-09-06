import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  IAnswerAttachment,
  AnswerAttachment,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
  override: Partial<IAnswerAttachment> = {},
  id?: UniqueEntityId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}
