import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

/** Port for user persistence operations. */
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
