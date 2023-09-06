import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotificationRepository } from '../repositories/notification-repository';
import { Notification } from '../../enterprise/entities/notification';

export interface SendNotificationRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationResponse = Either<null, { notification: Notification }>;

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
