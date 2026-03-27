import { User } from './user.entity';
import { Email } from '../value-objects/email.vo';

describe('User Entity', () => {
  const validProps = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: Email.create('test@example.com'),
    passwordHash: '$2b$10$hashedpassword',
    createdAt: new Date(),
  };

  it('should create a valid user', () => {
    const user = User.create(validProps);
    expect(user.id).toBe(validProps.id);
    expect(user.email.value).toBe('test@example.com');
    expect(user.passwordHash).toBe(validProps.passwordHash);
    expect(user.createdAt).toBe(validProps.createdAt);
  });

  it('should throw when id is empty', () => {
    expect(() => User.create({ ...validProps, id: '' })).toThrow(
      'User id is required'
    );
  });

  it('should throw when password hash is empty', () => {
    expect(() => User.create({ ...validProps, passwordHash: '' })).toThrow(
      'Password hash is required'
    );
  });
});
