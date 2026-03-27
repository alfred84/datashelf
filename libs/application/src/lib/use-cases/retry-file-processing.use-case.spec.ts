import { RetryFileProcessingUseCase } from './retry-file-processing.use-case';
import {
  FileRepository,
  ReportRepository,
  JobQueue,
  CsvFile,
  FileStatus,
} from '@datashelf/domain';

describe('RetryFileProcessingUseCase', () => {
  let useCase: RetryFileProcessingUseCase;
  let fileRepository: jest.Mocked<FileRepository>;
  let reportRepository: jest.Mocked<ReportRepository>;
  let jobQueue: jest.Mocked<JobQueue>;

  beforeEach(() => {
    fileRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    reportRepository = {
      findByFileId: jest.fn(),
      save: jest.fn(),
      deleteByFileId: jest.fn(),
    };
    jobQueue = { enqueue: jest.fn() };
    useCase = new RetryFileProcessingUseCase(
      fileRepository,
      reportRepository,
      jobQueue
    );
  });

  it('should retry a FAILED file', async () => {
    const file = CsvFile.create({
      id: 'file-1',
      userId: 'user-1',
      originalName: 'test.csv',
      displayName: 'test.csv',
      storagePath: '/uploads/test.csv',
      sizeBytes: 1024,
      status: FileStatus.FAILED,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });
    fileRepository.findById.mockResolvedValue(file);

    await useCase.execute({ fileId: 'file-1', userId: 'user-1' });

    expect(reportRepository.deleteByFileId).toHaveBeenCalledWith('file-1');
    expect(jobQueue.enqueue).toHaveBeenCalledWith('process-csv', {
      fileId: 'file-1',
    });
  });

  it('should throw when file is not in FAILED status', async () => {
    const file = CsvFile.create({
      id: 'file-1',
      userId: 'user-1',
      originalName: 'test.csv',
      displayName: 'test.csv',
      storagePath: '/uploads/test.csv',
      sizeBytes: 1024,
      status: FileStatus.COMPLETED,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });
    fileRepository.findById.mockResolvedValue(file);

    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'user-1' })
    ).rejects.toThrow('Cannot queue file');
  });

  it('should throw when user does not own the file', async () => {
    const file = CsvFile.create({
      id: 'file-1',
      userId: 'user-1',
      originalName: 'test.csv',
      displayName: 'test.csv',
      storagePath: '/uploads/test.csv',
      sizeBytes: 1024,
      status: FileStatus.FAILED,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });
    fileRepository.findById.mockResolvedValue(file);

    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'other-user' })
    ).rejects.toThrow('Access denied');
  });
});
