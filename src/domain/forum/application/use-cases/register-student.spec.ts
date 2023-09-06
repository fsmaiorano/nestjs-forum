import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository';
import { RegisterStudentUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let createRegisterStudentUseCase: RegisterStudentUseCase;

beforeEach(() => {
  inMemoryStudentRepository = new InMemoryStudentRepository();
  fakeHasher = new FakeHasher();
  createRegisterStudentUseCase = new RegisterStudentUseCase(
    inMemoryStudentRepository,
    fakeHasher,
  );
});

describe('CreateRegisterStudentUseCase', () => {
  test('should create an Student', async () => {
    const result = await createRegisterStudentUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    console.log(result);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    });
  });

  test('should hash student password upon registration', async () => {
    const result = await createRegisterStudentUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    console.log(result);

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword);
  });
});
