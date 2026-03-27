import { PrismaClient } from '../../generated/prisma/client';
import { User, UserRepository, Email } from '@datashelf/domain';

/** Prisma-based implementation of UserRepository. */
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.value },
    });
    if (!record) return null;
    return User.create({
      id: record.id,
      email: Email.create(record.email),
      passwordHash: record.passwordHash,
      createdAt: record.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return User.create({
      id: record.id,
      email: Email.create(record.email),
      passwordHash: record.passwordHash,
      createdAt: record.createdAt,
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.value,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
    });
  }
}
