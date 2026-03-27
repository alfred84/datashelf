import {
  FileRepository,
  NotFoundError,
  ForbiddenError,
} from '@datashelf/domain';

/** Input required to rename a file. */
export interface RenameFileInput {
  fileId: string;
  userId: string;
  displayName: string;
}

/** Renames the display name of an uploaded file without modifying stored content. */
export class RenameFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(input: RenameFileInput): Promise<void> {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) {
      throw new NotFoundError('File', input.fileId);
    }
    if (file.userId !== input.userId) {
      throw new ForbiddenError();
    }

    file.rename(input.displayName);
    await this.fileRepository.update(file);
  }
}
