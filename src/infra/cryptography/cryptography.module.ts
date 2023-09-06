import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypt';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HasherComparer } from '@/domain/forum/application/cryptography/hasher-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HasherComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HasherComparer, HashGenerator],
})
export class CryptographyModule {}
