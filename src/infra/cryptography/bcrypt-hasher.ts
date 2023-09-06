import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HasherComparer } from '@/domain/forum/application/cryptography/hasher-comparer';
import { hash } from 'bcryptjs';

export class BcryptHasher implements HashGenerator, HasherComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    const hashedPassword = await this.hash(plain);
    console.log(hashedPassword);
    console.log(hash);
    return hash === hashedPassword;
  }

  async hash(plain: string): Promise<string> {
    console.log(plain);
    return hash(plain, 8);
  }
}
