import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId.toString(),
    );

    return answerAttachments;
  }

  async create(answerAttachment: AnswerAttachment): Promise<void> {
    this.items.push(answerAttachment);
  }

  async delete(answerAttachment: AnswerAttachment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id === answerAttachment.id,
    );

    if (index === -1) {
      throw new Error(
        `AnswerAttachment with ID: ${answerAttachment.id} not found`,
      );
    }

    this.items.splice(index, 1);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId.toString(),
    );

    answerAttachments.forEach((answerAttachment) => {
      const index = this.items.findIndex(
        (item) => item.id === answerAttachment.id,
      );

      if (index === -1) {
        throw new Error(
          `AnswerAttachment with ID: ${answerAttachment.id} not found`,
        );
      }

      this.items.splice(index, 1);
    });
  }
}
