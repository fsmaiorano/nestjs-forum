import { Injectable } from '@nestjs/common';
import { Algorithm } from './../../node_modules/@types/jsonwebtoken/index.d';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from '@/env';
import { z } from 'zod';

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
