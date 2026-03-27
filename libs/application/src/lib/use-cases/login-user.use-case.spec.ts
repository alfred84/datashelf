import { LoginUserUseCase } from './login-user.use-case';
import {
  Email,
  UserRepository,
  PasswordHasher,
  TokenService,
  User,
} from '@datashelf/domain';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let tokenService: jest.Mocked<TokenService>;

  const existingUser = User.create({
    id: 'user-uuid',
    email: Email.create('test@example.com'),
    passwordHash: 'hashed-password',
    createdAt: new Date(),
  });

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    tokenService = {
      generate: jest.fn(),
      verify: jest.fn(),
    };
    useCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
  });

  it('should login successfully with correct credentials', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(true);
    tokenService.generate.mockReturnValue('jwt-token');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'securePass1',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user.id).toBe('user-uuid');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw for unknown email', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'unknown@example.com', password: 'securePass1' })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw for wrong password', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'wrongpass' })
    ).rejects.toThrow('Invalid email or password');
  });
});
