import { EnqueueFileProcessingUseCase } from './enqueue-file-processing.use-case';
import {
  FileRepository,
  JobQueue,
  CsvFile,
  FileStatus,
} from '@datashelf/domain';

describe('EnqueueFileProcessingUseCase', () => {
  let useCase: EnqueueFileProcessingUseCase;
  let fileRepository: jest.Mocked<FileRepository>;
  let jobQueue: jest.Mocked<JobQueue>;

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
    jobQueue = { enqueue: jest.fn() };
    useCase = new EnqueueFileProcessingUseCase(fileRepository, jobQueue);
  });

  it('should enqueue a file for processing', async () => {
    fileRepository.findById.mockResolvedValue(file);

    await useCase.execute('file-1');

    expect(jobQueue.enqueue).toHaveBeenCalledWith('process-csv', {
      fileId: 'file-1',
    });
    expect(fileRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should throw when file not found', async () => {
    fileRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toThrow('not found');
  });
});
