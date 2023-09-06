import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateUniqueDataBaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const dataBaseUrl = generateUniqueDataBaseUrl(schemaId);
  process.env.DATABASE_URL = dataBaseUrl;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  const command = `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`;
  await prisma.$executeRawUnsafe(command);
  await prisma.$disconnect();
});
