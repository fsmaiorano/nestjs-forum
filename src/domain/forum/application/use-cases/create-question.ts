import { Question } from './../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { Either, right } from '@/core/either';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';

interface CreateQuestionRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds?: string[];
}

type CreateQuestionResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId,
      title,
      content,
    });

    const questionAttachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    if (questionAttachments) {
      question.attachments = new QuestionAttachmentList(questionAttachments);
    }

    await this.questionRepository.create(question);

    return right({ question });
  }
}
