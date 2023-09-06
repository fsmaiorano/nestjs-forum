import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface IStudent {
  name: string;
}

export class Student extends Entity<IStudent> {
  static create(props: IStudent, id?: UniqueEntityId) {
    const student = new Student({ ...props }, id);

    return student;
  }
}
