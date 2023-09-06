import { AnswerRepository } from '@/domain/forum/application/repositories/answer-respository';
import { SendNotificationUseCase } from './../application/use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionBestQuestionChoosenEvent } from '@/domain/forum/enterprise/entities/events/question-best-answer-choosen-event';

export class OnQuestionBestAnswerChoosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      OnQuestionBestAnswerChoosen.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChoosenEvent) {
    console.log('sendQuestionBestAnswerNotification');
    console.log(question);
    console.log(bestAnswerId);

    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Your question has been choosen`,
        content: `The answer "${answer.excerpt
          .substring(0, 20)
          .concat(
            '...',
          )}" has been choosen as the best answer for your question "${
          question.title
        }"`,
      });
    }
  }
}
