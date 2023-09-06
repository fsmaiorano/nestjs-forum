import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Fetch recents (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);
    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@test.com',
        password: await hash('123456', 8),
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          content: 'Question 1 content',
          slug: 'question-01',
          authorId: user.id,
        },
        {
          title: 'Question 2',
          content: 'Question 2 content',
          slug: 'question-02',
          authorId: user.id,
        },
        {
          title: 'Question 3',
          content: 'Question 3 content',
          slug: 'question-03',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Question 1',
          content: 'Question 1 content',
          slug: 'question-01',
          authorId: user.id,
        }),
        expect.objectContaining({
          title: 'Question 2',
          content: 'Question 2 content',
          slug: 'question-02',
          authorId: user.id,
        }),
        expect.objectContaining({
          title: 'Question 3',
          content: 'Question 3 content',
          slug: 'question-03',
          authorId: user.id,
        }),
      ],
    });
  });
});
