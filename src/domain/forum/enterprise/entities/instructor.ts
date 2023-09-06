import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface IIntstructor {
  name: string;
}

export class Instructor extends Entity<IIntstructor> {
  static create(props: IIntstructor, id?: UniqueEntityId) {
    const instructor = new Instructor({ ...props }, id);

    return instructor;
  }
}
