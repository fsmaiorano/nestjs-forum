import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  IAnswerComment,
  AnswerComment,
} from '@/domain/forum/enterprise/entities/answer-comment';

export function makeAnswerComment(
  override: Partial<IAnswerComment> = {},
  id?: UniqueEntityId,
) {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answercomment;
}
