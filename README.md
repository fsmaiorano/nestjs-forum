## About

This is a simple project that simulates a forum system. It is built with NestJS.

## Architecture
Clean architecture is used to separate the application into layers. The layers are as follows: application, domain, and infrastructure. The application layer contains use-cases and all core implementations. The domain layer contains the business logic and models. The infrastructure layer contains the database context and migrations.

The implementation between the Api and the rest of the application is built with CQRS (Command and Query Responsibility Segregation), a pattern that separates read and update operations for a data store.

## Technologies Used
- NestJS
- NodeJS
- Typescript
- Postgres
- Prisma
- Docker
- Vitest
- Supertest
- JWT
- Bcrypt
- Lint
- Passport-JWT
- Zod

## How to run

### Prerequisites
- NodeJS
- NPM
- Docker

### Steps
1. Clone the repository
2. Run `npm install`
3. Run `docker-compose up -d`
4. Run `npm run start:dev

## How to run tests
1. Run `npm run test
2. Run `npm run test:2e2

### Prisma
1. Run `npx prisma migrate dev
2. Run `npx prisma studio

### Attention
- This project is still in development
- The .env file is included in the repository for testing purposes only. In a real project, it should be kept secret.
- The private and public keys are included in the repository for testing purposes only. In a real project, they should be kept secret.