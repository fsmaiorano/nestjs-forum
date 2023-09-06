import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = [];

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: { page: number }) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId.toString())
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async create(answer: AnswerComment): Promise<void> {
    this.items.push(answer);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answerComment.id);

    if (index === -1) {
      throw new Error(`AnswerComment with ID: ${answerComment.id} not found`);
    }

    this.items.splice(index, 1);
  }
}
