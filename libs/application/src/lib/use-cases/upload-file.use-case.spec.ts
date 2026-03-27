import { UploadFileUseCase } from './upload-file.use-case';
import { FileRepository, FileStorageService } from '@datashelf/domain';

describe('UploadFileUseCase', () => {
  let useCase: UploadFileUseCase;
  let fileRepository: jest.Mocked<FileRepository>;
  let fileStorage: jest.Mocked<FileStorageService>;

  beforeEach(() => {
    fileRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    fileStorage = {
      store: jest.fn(),
      retrieve: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UploadFileUseCase(fileRepository, fileStorage);
  });

  it('should upload a valid CSV file', async () => {
    fileStorage.store.mockResolvedValue('/uploads/test.csv');

    const result = await useCase.execute({
      userId: 'user-uuid',
      originalName: 'test.csv',
      content: Buffer.from('name,age\nAlice,30'),
      sizeBytes: 100,
    });

    expect(result.originalName).toBe('test.csv');
    expect(result.status).toBe('UPLOADED');
    expect(fileRepository.save).toHaveBeenCalledTimes(1);
    expect(fileStorage.store).toHaveBeenCalledTimes(1);
  });

  it('should reject files larger than 25MB', async () => {
    await expect(
      useCase.execute({
        userId: 'user-uuid',
        originalName: 'big.csv',
        content: Buffer.alloc(1),
        sizeBytes: 26 * 1024 * 1024,
      })
    ).rejects.toThrow('exceeds maximum size');
  });

  it('should reject non-CSV files', async () => {
    await expect(
      useCase.execute({
        userId: 'user-uuid',
        originalName: 'data.txt',
        content: Buffer.from('data'),
        sizeBytes: 100,
      })
    ).rejects.toThrow('Only CSV files are allowed');
  });
});
