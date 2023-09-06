import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  private value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ? value : randomUUID();
  }

  equals(id?: UniqueEntityId): boolean {
    if (!id) {
      return false;
    }

    return id.toValue() === this.value;
  }
}
