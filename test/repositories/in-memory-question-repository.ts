import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id);

    if (index === -1) {
      throw new Error(`Question with ID: ${question.id} not found`);
    }

    this.items.splice(index, 1);

    await this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id);

    if (index === -1) {
      throw new Error(`Question with ID: ${question.id} not found`);
    }

    this.items[index] = question;
    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
