import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  // .default('postgres://postgres:postgres@localhost:5432/postgres'),
  //   CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;
