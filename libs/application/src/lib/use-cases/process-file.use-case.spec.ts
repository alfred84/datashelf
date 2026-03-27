import { ProcessFileUseCase } from './process-file.use-case';
import {
  FileRepository,
  ReportRepository,
  FileStorageService,
  CsvFile,
  FileStatus,
} from '@datashelf/domain';

describe('ProcessFileUseCase', () => {
  let useCase: ProcessFileUseCase;
  let fileRepository: jest.Mocked<FileRepository>;
  let reportRepository: jest.Mocked<ReportRepository>;
  let fileStorage: jest.Mocked<FileStorageService>;

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
    fileStorage = {
      store: jest.fn(),
      retrieve: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new ProcessFileUseCase(
      fileRepository,
      reportRepository,
      fileStorage
    );
  });

  it('should process a valid CSV and create a report', async () => {
    const csvContent = 'name,age,active\nAlice,30,true\nBob,,false\n';
    const file = CsvFile.create({
      id: 'file-1',
      userId: 'user-1',
      originalName: 'test.csv',
      displayName: 'test.csv',
      storagePath: '/uploads/test.csv',
      sizeBytes: csvContent.length,
      status: FileStatus.QUEUED,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    fileRepository.findById.mockResolvedValue(file);
    fileStorage.retrieve.mockResolvedValue(Buffer.from(csvContent));

    await useCase.execute('file-1');

    expect(reportRepository.save).toHaveBeenCalledTimes(1);
    const savedReport = reportRepository.save.mock.calls[0][0];
    expect(savedReport.rowCount).toBe(2);
    expect(savedReport.columnCount).toBe(3);
    expect(savedReport.columnNames).toEqual(['name', 'age', 'active']);
    expect(fileRepository.update).toHaveBeenCalled();
  });

  it('should handle empty CSV gracefully', async () => {
    const csvContent = '';
    const file = CsvFile.create({
      id: 'file-2',
      userId: 'user-1',
      originalName: 'empty.csv',
      displayName: 'empty.csv',
      storagePath: '/uploads/empty.csv',
      sizeBytes: 0,
      status: FileStatus.QUEUED,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    fileRepository.findById.mockResolvedValue(file);
    fileStorage.retrieve.mockResolvedValue(Buffer.from(csvContent));

    await useCase.execute('file-2');

    expect(reportRepository.save).toHaveBeenCalledTimes(1);
    const savedReport = reportRepository.save.mock.calls[0][0];
    expect(savedReport.rowCount).toBe(0);
    expect(savedReport.columnCount).toBe(0);
  });

  it('should throw when file not found', async () => {
    fileRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toThrow('not found');
  });
});
