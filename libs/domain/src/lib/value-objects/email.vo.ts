/** Value object representing a validated email address. */
export class Email {
  private constructor(readonly value: string) {}

  /** Creates an Email value object, validating format. */
  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new Error('Email is required');
    }
    const trimmed = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error('Invalid email format');
    }
    return new Email(trimmed);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
