import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

beforeEach(() => {
  inMemoryStudentRepository = new InMemoryStudentRepository();
  fakeHasher = new FakeHasher();
  sut = new AuthenticateStudentUseCase(
    inMemoryStudentRepository,
    fakeHasher,
    fakeEncrypter,
  );
  fakeEncrypter = new FakeEncrypter();
});

describe('AuthenticateStudentUseCase', () => {
  test('should authenticate an Student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryStudentRepository.items.push(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      access_token: expect.any(String),
    });
  });
});
