import { v4 as uuidv4 } from 'uuid';
import {
  Email,
  User,
  UserRepository,
  PasswordHasher,
  UserAlreadyExistsError,
  DomainError,
} from '@datashelf/domain';
import { RegisterDto } from '@datashelf/shared';

/** Result of a successful registration. */
export interface RegisterResult {
  id: string;
  email: string;
}

/** Registers a new user with validated credentials. */
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
    if (!dto.password || dto.password.length < 8) {
      throw new DomainError('Password must be at least 8 characters');
    }

    const email = Email.create(dto.email);
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new UserAlreadyExistsError(email.value);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = User.create({
      id: uuidv4(),
      email,
      passwordHash,
      createdAt: new Date(),
    });

    await this.userRepository.save(user);

    return { id: user.id, email: user.email.value };
  }
}
