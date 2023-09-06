import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HasherComparer } from '@/domain/forum/application/cryptography/hasher-comparer';

export class FakeHasher implements HashGenerator, HasherComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }
}
