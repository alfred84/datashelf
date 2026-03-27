import {
  Email,
  UserRepository,
  PasswordHasher,
  TokenService,
  InvalidCredentialsError,
} from '@datashelf/domain';
import { LoginDto, AuthResponseDto } from '@datashelf/shared';

/** Authenticates a user and returns a JWT token. */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash
    );
    if (!passwordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.generate({
      userId: user.id,
      email: user.email.value,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email.value },
    };
  }
}
