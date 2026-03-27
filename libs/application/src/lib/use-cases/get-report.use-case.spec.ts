import { GetReportUseCase } from './get-report.use-case';
import {
  FileRepository,
  ReportRepository,
  CsvFile,
  Report,
  FileStatus,
} from '@datashelf/domain';

describe('GetReportUseCase', () => {
  let useCase: GetReportUseCase;
  let fileRepository: jest.Mocked<FileRepository>;
  let reportRepository: jest.Mocked<ReportRepository>;

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

  const report = Report.create({
    id: 'report-1',
    fileId: 'file-1',
    rowCount: 10,
    columnCount: 3,
    columnNames: ['a', 'b', 'c'],
    columnTypes: { a: 'string', b: 'number', c: 'boolean' },
    emptyCountPerColumn: { a: 0, b: 1, c: 0 },
    previewRows: [{ a: '1', b: '2', c: 'true' }],
    createdAt: new Date(),
  });

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
    useCase = new GetReportUseCase(fileRepository, reportRepository);
  });

  it('should return report for a completed file', async () => {
    fileRepository.findById.mockResolvedValue(file);
    reportRepository.findByFileId.mockResolvedValue(report);

    const result = await useCase.execute({ fileId: 'file-1', userId: 'user-1' });

    expect(result.rowCount).toBe(10);
    expect(result.columnNames).toEqual(['a', 'b', 'c']);
  });

  it('should throw when file not found', async () => {
    fileRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ fileId: 'missing', userId: 'user-1' })
    ).rejects.toThrow('not found');
  });

  it('should throw when user does not own file', async () => {
    fileRepository.findById.mockResolvedValue(file);
    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'other-user' })
    ).rejects.toThrow('Access denied');
  });

  it('should throw when report not yet generated', async () => {
    fileRepository.findById.mockResolvedValue(file);
    reportRepository.findByFileId.mockResolvedValue(null);
    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'user-1' })
    ).rejects.toThrow('not found');
  });
});
