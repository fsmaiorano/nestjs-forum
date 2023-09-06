import { Answer } from '../../enterprise/entities/answer';

export interface AnswerRepository {
  create(answer: Answer): Promise<void>;
  save(question: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: { page: number },
  ): Promise<Answer[]>;
  delete(answer: Answer): Promise<void>;
}
