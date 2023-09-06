import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  IQuestionAttachment,
  QuestionAttachment,
} from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(
  override: Partial<IQuestionAttachment> = {},
  id?: UniqueEntityId,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return questionAttachment;
}
