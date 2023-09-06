import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';

interface EditQuestionRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds?: string[];
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    if (questionAttachments) {
      questionAttachmentList.update(questionAttachments);
    }

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
