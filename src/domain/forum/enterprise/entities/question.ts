import { AggregateRoot } from '@/core/entities/aggregate-root';
import { Slug } from './value-objects/slug';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestQuestionChoosenEvent } from './events/question-best-answer-choosen-event';
import dayjs from 'dayjs';

export interface IQuestion {
  authorId: string;
  bestAnswerId?: UniqueEntityId;
  attachments: QuestionAttachmentList;
  title: string;
  content: string;
  slug: Slug;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<IQuestion> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestQuestionChoosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    if (title.length > 120) {
      throw new Error('Question title length must be less than 120 characters');
    }

    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    if (content.length > 2400) {
      throw new Error(
        'Answer content length must be less than 2400 characters',
      );
    }

    this.props.content = content;
    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat('...');
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew() {
    return dayjs().diff(this.props.createdAt, 'days') <= 3;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<IQuestion, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
