import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '@datashelf/domain';

const SALT_ROUNDS = 10;

/** Bcrypt implementation of PasswordHasher. */
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
