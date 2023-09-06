import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IComment {
  authorId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<T extends IComment> extends Entity<T> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    if (content.length > 2400) {
      throw new Error(
        'Comment content length must be less than 2400 characters',
      );
    }

    this.props.content = content;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
