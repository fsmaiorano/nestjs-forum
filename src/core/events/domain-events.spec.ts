import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityId } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { vi } from 'vitest';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(public a: CustomAggregate) {
    this.aggregate = a;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('DomainEvents', () => {
  it('should dispatch and listen events', () => {
    const callbackSpy = vi.fn();

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents.length).toBe(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
