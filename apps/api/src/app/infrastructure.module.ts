import { Module, Global } from '@nestjs/common';
import {
  getPrismaClient,
  PrismaUserRepository,
  PrismaFileRepository,
  PrismaReportRepository,
  BcryptPasswordHasher,
  JwtTokenService,
  LocalFileStorageAdapter,
  BullMQJobQueueAdapter,
} from '@datashelf/infrastructure';
import { INJECTION_TOKENS } from '@datashelf/shared';

const prismaClient = getPrismaClient();
const jwtExpiresInSeconds = Number.parseInt(
  process.env['JWT_EXPIRES_IN_SECONDS'] || '86400',
  10
);

@Global()
@Module({
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useValue: prismaClient,
    },
    {
      provide: INJECTION_TOKENS.USER_REPOSITORY,
      useFactory: () => new PrismaUserRepository(prismaClient),
    },
    {
      provide: INJECTION_TOKENS.FILE_REPOSITORY,
      useFactory: () => new PrismaFileRepository(prismaClient),
    },
    {
      provide: INJECTION_TOKENS.REPORT_REPOSITORY,
      useFactory: () => new PrismaReportRepository(prismaClient),
    },
    {
      provide: INJECTION_TOKENS.PASSWORD_HASHER,
      useFactory: () => new BcryptPasswordHasher(),
    },
    {
      provide: INJECTION_TOKENS.TOKEN_SERVICE,
      useFactory: () =>
        new JwtTokenService(
          process.env['JWT_SECRET'] || 'default-secret',
          Number.isNaN(jwtExpiresInSeconds) ? 86400 : jwtExpiresInSeconds
        ),
    },
    {
      provide: INJECTION_TOKENS.FILE_STORAGE,
      useFactory: () =>
        new LocalFileStorageAdapter(process.env['UPLOAD_DIR'] || './uploads'),
    },
    {
      provide: INJECTION_TOKENS.JOB_QUEUE,
      useFactory: () =>
        new BullMQJobQueueAdapter(
          process.env['REDIS_HOST'] || 'redis',
          parseInt(process.env['REDIS_PORT'] || '6379', 10)
        ),
    },
  ],
  exports: [
    'PRISMA_CLIENT',
    INJECTION_TOKENS.USER_REPOSITORY,
    INJECTION_TOKENS.FILE_REPOSITORY,
    INJECTION_TOKENS.REPORT_REPOSITORY,
    INJECTION_TOKENS.PASSWORD_HASHER,
    INJECTION_TOKENS.TOKEN_SERVICE,
    INJECTION_TOKENS.FILE_STORAGE,
    INJECTION_TOKENS.JOB_QUEUE,
  ],
})
export class InfrastructureModule {}
