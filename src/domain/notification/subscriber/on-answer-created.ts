import { SendNotificationUseCase } from './../application/use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/entities/events/answer-created-event';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Your question "${question.title}" has a new answer`,
        content: answer.excerpt,
      });
    }
  }
}
