import { DomainEvents } from '@/core/events/domain-events';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-respository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: { page: number }) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId.toString())
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    if (index === -1) {
      throw new Error(`Answer with ID: ${answer.id} not found`);
    }

    this.items.splice(index, 1);

    await this.answerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    if (index === -1) {
      throw new Error(`Answer with ID: ${answer.id} not found`);
    }

    this.items[index] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
