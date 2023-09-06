import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<T> {
  private _id: UniqueEntityId;
  protected props: T;

  get id() {
    return this._id;
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === this) {
      return true;
    }

    if (entity?.id === this._id) {
      return true;
    }

    return false;
  }
}
