import {
  IQuestion,
  Question,
} from '@/domain/forum/enterprise/entities/question';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export function makeQuestion(
  override: Partial<IQuestion> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create('my-new-question'),
      authorId: new UniqueEntityId().toString(),
      ...override,
    },
    id,
  );

  return question;
}
