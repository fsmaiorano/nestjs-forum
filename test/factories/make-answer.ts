import { IAnswer, Answer } from '@/domain/forum/enterprise/entities/answer';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeAnswer(
  override: Partial<IAnswer> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId().toString(),
      questionId: new UniqueEntityId().toString(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id,
  );

  return answer;
}
