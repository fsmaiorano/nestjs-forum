import { Student } from './../../enterprise/entities/student';
import { StudentRepository } from '../repositories/student-repository';
import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { Injectable } from '@nestjs/common';

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentRepository.create(student);

    return right({ student });
  }
}
