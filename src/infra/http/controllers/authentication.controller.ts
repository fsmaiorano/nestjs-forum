import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { z } from 'zod';

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type authenticationBodySchema = z.infer<typeof authenticationBodySchema>;

const validationPipe = new ZodValidationPipe(authenticationBodySchema);

@Controller('/sessions')
export class AuthenticationController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(validationPipe)
  async handle(@Body() body: authenticationBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwt.sign({ sub: user.id });
    return {
      access_token: accessToken,
    };
  }
}
