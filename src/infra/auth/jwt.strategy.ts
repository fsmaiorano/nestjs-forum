import { Injectable } from '@nestjs/common';
import { Algorithm } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { Env } from '../env';

const userPayload = z.object({
  sub: z.string(),
  // email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

export type UserPayload = z.infer<typeof userPayload>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: Buffer.from(publicKey, 'base64'),
      Algorithms: ['RS256'] as Algorithm[],
    });
  }

  async validate(payload: UserPayload) {
    return userPayload.parse(payload);
  }
}
