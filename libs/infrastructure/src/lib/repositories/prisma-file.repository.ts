import {
  PrismaClient,
  FileStatus as PrismaFileStatus,
  File as PrismaFile,
} from '../../generated/prisma/client';
import { CsvFile, FileRepository, FileStatus } from '@datashelf/domain';

/** Maps Prisma FileStatus enum to domain FileStatus. */
function toDomainStatus(status: PrismaFileStatus): FileStatus {
  return FileStatus[status as keyof typeof FileStatus];
}

/** Maps domain FileStatus to Prisma FileStatus. */
function toPrismaStatus(status: FileStatus): PrismaFileStatus {
  return status as unknown as PrismaFileStatus;
}

function toDomain(r: PrismaFile): CsvFile {
  return CsvFile.create({
    id: r.id,
    userId: r.userId,
    originalName: r.originalName,
    displayName: r.displayName,
    storagePath: r.storagePath,
    sizeBytes: r.sizeBytes,
    status: toDomainStatus(r.status),
    uploadedAt: r.uploadedAt,
    updatedAt: r.updatedAt,
  });
}

/** Prisma-based implementation of FileRepository. */
export class PrismaFileRepository implements FileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<CsvFile | null> {
    const record = await this.prisma.file.findUnique({ where: { id } });
    if (!record) return null;
    return toDomain(record);
  }

  async findByUserId(userId: string): Promise<CsvFile[]> {
    const records = await this.prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
    return records.map(toDomain);
  }

  async save(file: CsvFile): Promise<void> {
    await this.prisma.file.create({
      data: {
        id: file.id,
        userId: file.userId,
        originalName: file.originalName,
        displayName: file.displayName,
        storagePath: file.storagePath,
        sizeBytes: file.sizeBytes,
        status: toPrismaStatus(file.status),
        uploadedAt: file.uploadedAt,
        updatedAt: file.updatedAt,
      },
    });
  }

  async update(file: CsvFile): Promise<void> {
    await this.prisma.file.update({
      where: { id: file.id },
      data: {
        displayName: file.displayName,
        status: toPrismaStatus(file.status),
        updatedAt: file.updatedAt,
      },
    });
  }
}
