import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student-repository';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { HasherComparer } from '../cryptography/hasher-comparer';

interface AuthenticateStudentRequest {
  email: string;
  password: string;
}

type AuthenticateStudentResponse = Either<
  WrongCredentialsError,
  { access_token: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashComparer: HasherComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      id: student.id,
      name: student.name,
      email: student.email,
    });

    return right({ access_token: accessToken });
  }
}
