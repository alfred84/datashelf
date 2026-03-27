import { Email } from '../value-objects/email.vo';

/** Domain entity representing a registered user. */
export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string;
  createdAt: Date;
}

/** Immutable domain entity for a DataShelf user. */
export class User {
  readonly id: string;
  readonly email: Email;
  readonly passwordHash: string;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
  }

  /** Factory method that validates invariants before creation. */
  static create(props: UserProps): User {
    if (!props.id) {
      throw new Error('User id is required');
    }
    if (!props.passwordHash) {
      throw new Error('Password hash is required');
    }
    return new User(props);
  }
}
