import { Either, left, right } from '@/core/either';
import { NotificationRepository } from '../repositories/notification-repository';
import { Notification } from '../../enterprise/entities/notification';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

export interface ReadNotificationRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationRepository.save(notification);

    return right({ notification });
  }
}
