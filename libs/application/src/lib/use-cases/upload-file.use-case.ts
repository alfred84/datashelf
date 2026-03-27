import { v4 as uuidv4 } from 'uuid';
import {
  CsvFile,
  FileRepository,
  FileStorageService,
  FileStatus,
} from '@datashelf/domain';
import { FileResponseDto } from '@datashelf/shared';

/** Input required to upload a file. */
export interface UploadFileInput {
  userId: string;
  originalName: string;
  content: Buffer;
  sizeBytes: number;
}

/** Handles CSV file upload, storage, and metadata persistence. */
export class UploadFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly fileStorage: FileStorageService
  ) {}

  async execute(input: UploadFileInput): Promise<FileResponseDto> {
    const now = new Date();
    const fileId = uuidv4();
    const storageName = `${fileId}-${input.originalName}`;

    const file = CsvFile.create({
      id: fileId,
      userId: input.userId,
      originalName: input.originalName,
      displayName: input.originalName,
      storagePath: '',
      sizeBytes: input.sizeBytes,
      status: FileStatus.UPLOADED,
      uploadedAt: now,
      updatedAt: now,
    });

    const storagePath = await this.fileStorage.store(storageName, input.content);

    const fileWithPath = CsvFile.create({
      ...{
        id: file.id,
        userId: file.userId,
        originalName: file.originalName,
        displayName: file.displayName,
        storagePath,
        sizeBytes: file.sizeBytes,
        status: file.status,
        uploadedAt: file.uploadedAt,
        updatedAt: file.updatedAt,
      },
    });

    await this.fileRepository.save(fileWithPath);

    return {
      id: fileWithPath.id,
      originalName: fileWithPath.originalName,
      displayName: fileWithPath.displayName,
      sizeBytes: fileWithPath.sizeBytes,
      status: fileWithPath.status,
      uploadedAt: fileWithPath.uploadedAt.toISOString(),
      updatedAt: fileWithPath.updatedAt.toISOString(),
    };
  }
}
