import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment-repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comment-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';

@Module({
  providers: [
    PrismaService,
    PrismaQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
