import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryNotificationRepository } from './../../../../../test/repositories/in-memory-notification-repository';
import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

beforeEach(() => {
  inMemoryNotificationRepository = new InMemoryNotificationRepository();
  sut = new SendNotificationUseCase(inMemoryNotificationRepository);
});

describe('CreateNotificationUseCase', () => {
  test('should create an Notification', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      title: 'new response',
      content: 'new response',
    });

    expect(result.isRight()).toBeTruthy();
  });
});
