import { RenameFileUseCase } from './rename-file.use-case';
import { FileRepository, CsvFile, FileStatus } from '@datashelf/domain';

describe('RenameFileUseCase', () => {
  let useCase: RenameFileUseCase;
  let fileRepository: jest.Mocked<FileRepository>;

  const file = CsvFile.create({
    id: 'file-1',
    userId: 'user-1',
    originalName: 'test.csv',
    displayName: 'test.csv',
    storagePath: '/uploads/test.csv',
    sizeBytes: 1024,
    status: FileStatus.UPLOADED,
    uploadedAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    fileRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    useCase = new RenameFileUseCase(fileRepository);
  });

  it('should rename a file successfully', async () => {
    fileRepository.findById.mockResolvedValue(file);

    await useCase.execute({ fileId: 'file-1', userId: 'user-1', displayName: 'renamed.csv' });

    expect(fileRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should throw when file not found', async () => {
    fileRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ fileId: 'missing', userId: 'user-1', displayName: 'new' })
    ).rejects.toThrow('not found');
  });

  it('should throw when user does not own the file', async () => {
    fileRepository.findById.mockResolvedValue(file);

    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'other-user', displayName: 'new' })
    ).rejects.toThrow('Access denied');
  });
});
