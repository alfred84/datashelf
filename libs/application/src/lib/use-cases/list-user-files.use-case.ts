import { FileRepository } from '@datashelf/domain';
import { FileResponseDto } from '@datashelf/shared';

/** Returns all files belonging to a specific user. */
export class ListUserFilesUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(userId: string): Promise<FileResponseDto[]> {
    const files = await this.fileRepository.findByUserId(userId);
    return files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      displayName: f.displayName,
      sizeBytes: f.sizeBytes,
      status: f.status,
      uploadedAt: f.uploadedAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  }
}
