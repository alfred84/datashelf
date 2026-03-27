import { ListUserFilesUseCase } from './list-user-files.use-case';
import { FileRepository, CsvFile, FileStatus } from '@datashelf/domain';

describe('ListUserFilesUseCase', () => {
  let useCase: ListUserFilesUseCase;
  let fileRepository: jest.Mocked<FileRepository>;

  beforeEach(() => {
    fileRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    useCase = new ListUserFilesUseCase(fileRepository);
  });

  it('should return files for a given user', async () => {
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
    fileRepository.findByUserId.mockResolvedValue([file]);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('file-1');
  });

  it('should return empty array when user has no files', async () => {
    fileRepository.findByUserId.mockResolvedValue([]);
    const result = await useCase.execute('user-1');
    expect(result).toHaveLength(0);
  });
});
