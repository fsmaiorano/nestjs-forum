import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type authenticationBodySchema = z.infer<typeof authenticationBodySchema>;

const validationPipe = new ZodValidationPipe(authenticationBodySchema);

@Controller('/sessions')
@Public()
export class AuthenticationController {
  constructor(
    private jwt: JwtService,
    private authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @UsePipes(validationPipe)
  async handle(@Body() body: authenticationBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    console.log(result.value);

    const { access_token } = result.value;

    return {
      access_token,
    };
  }
}
