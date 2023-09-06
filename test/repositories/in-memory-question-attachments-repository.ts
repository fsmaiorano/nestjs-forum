import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId.toString(),
    );

    return questionAttachments;
  }

  async create(questionAttachment: QuestionAttachment): Promise<void> {
    this.items.push(questionAttachment);
  }

  async delete(questionAttachment: QuestionAttachment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id === questionAttachment.id,
    );

    if (index === -1) {
      throw new Error(
        `QuestionAttachment with ID: ${questionAttachment.id} not found`,
      );
    }

    this.items.splice(index, 1);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId.toString(),
    );

    questionAttachments.forEach((questionAttachment) => {
      const index = this.items.findIndex(
        (item) => item.id === questionAttachment.id,
      );

      if (index === -1) {
        throw new Error(
          `QuestionAttachment with ID: ${questionAttachment.id} not found`,
        );
      }

      this.items.splice(index, 1);
    });
  }
}
