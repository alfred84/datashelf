import * as path from 'path';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const SALT_ROUNDS = 10;

interface SeedUser {
  email: string;
  password: string;
}

const DEFAULT_USERS: SeedUser[] = [
  { email: 'admin@datashelf.com', password: 'password123' },
];

async function main(): Promise<void> {
  const url = process.env['DATABASE_URL'] || '';
  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const user of DEFAULT_USERS) {
      const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          passwordHash,
        },
      });
      console.log(`Seeded user: ${user.email}`);
    }
    console.log('Seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
