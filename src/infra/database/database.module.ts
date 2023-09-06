import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment-repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comment-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    PrismaQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
  ],
  exports: [PrismaService, QuestionRepository, StudentRepository],
})
export class DatabaseModule {}
