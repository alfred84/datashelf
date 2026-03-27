import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('USER@Example.COM');
    expect(email.value).toBe('user@example.com');
  });

  it('should throw for empty email', () => {
    expect(() => Email.create('')).toThrow('Email is required');
  });

  it('should throw for invalid format', () => {
    expect(() => Email.create('not-an-email')).toThrow('Invalid email format');
  });

  it('should throw for email without domain', () => {
    expect(() => Email.create('user@')).toThrow('Invalid email format');
  });

  it('should trim whitespace', () => {
    const email = Email.create('  test@example.com  ');
    expect(email.value).toBe('test@example.com');
  });

  it('should compare equality correctly', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('TEST@Example.com');
    expect(email1.equals(email2)).toBe(true);
  });

  it('should return string representation', () => {
    const email = Email.create('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });
});
