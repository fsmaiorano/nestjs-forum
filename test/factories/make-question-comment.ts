import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  IQuestionComment,
  QuestionComment,
} from '@/domain/forum/enterprise/entities/question-comment';

export function makeQuestionComment(
  override: Partial<IQuestionComment> = {},
  id?: UniqueEntityId,
) {
  const questioncomment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questioncomment;
}
