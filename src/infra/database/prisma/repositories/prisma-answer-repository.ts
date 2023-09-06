import { AnswerRepository } from '@/domain/forum/application/repositories/answer-respository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(question: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.');
  }
  findManyByQuestionId(
    questionId: string,
    params: { page: number },
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.');
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
