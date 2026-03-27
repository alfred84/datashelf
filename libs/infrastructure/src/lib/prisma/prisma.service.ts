import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let prismaInstance: PrismaClient | null = null;

/** Returns a singleton PrismaClient instance using the pg adapter. */
export function getPrismaClient(databaseUrl?: string): PrismaClient {
  if (!prismaInstance) {
    const url = databaseUrl || process.env['DATABASE_URL'] || '';
    const adapter = new PrismaPg({ connectionString: url });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

/** Disconnects the PrismaClient and closes the pool. */
export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}
