import { RegisterUserUseCase } from './register-user.use-case';
import { Email, UserRepository, PasswordHasher, User } from '@datashelf/domain';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasher>;

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
    useCase = new RegisterUserUseCase(userRepository, passwordHasher);
  });

  it('should register a new user successfully', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'securePass1',
    });

    expect(result.email).toBe('test@example.com');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(passwordHasher.hash).toHaveBeenCalledWith('securePass1');
  });

  it('should throw when email already exists', async () => {
    const existingUser = User.create({
      id: 'existing-id',
      email: Email.create('test@example.com'),
      passwordHash: 'hash',
      createdAt: new Date(),
    });
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'securePass1' })
    ).rejects.toThrow('already exists');
  });

  it('should throw when password is too short', async () => {
    await expect(
      useCase.execute({ email: 'test@example.com', password: 'short' })
    ).rejects.toThrow('at least 8 characters');
  });

  it('should throw for invalid email format', async () => {
    await expect(
      useCase.execute({ email: 'not-an-email', password: 'securePass1' })
    ).rejects.toThrow('Invalid email format');
  });
});
