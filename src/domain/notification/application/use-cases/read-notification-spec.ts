import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryNotificationRepository } from './../../../../../test/repositories/in-memory-notification-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

beforeEach(() => {
  inMemoryNotificationRepository = new InMemoryNotificationRepository();
  sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
});

describe('ReadNotificationUseCase', () => {
  test('should read an Notification', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      notificationId: new UniqueEntityId().toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationRepository.items[0].readAt).not.toBeNull();
  });

  test('should not read an Notification with invalid recipientId', async () => {
    const result = await sut.execute({
      recipientId: 'invalid-recipient-id',
      notificationId: new UniqueEntityId().toString(),
    });

    expect(result.isLeft()).toBeTruthy();
  });

  test('should not be able read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('user-id'),
    });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
