import { DownloadReportUseCase } from './download-report.use-case';
import {
  FileRepository,
  ReportRepository,
  CsvFile,
  Report,
  FileStatus,
} from '@datashelf/domain';

describe('DownloadReportUseCase', () => {
  let useCase: DownloadReportUseCase;
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
    useCase = new DownloadReportUseCase(fileRepository, reportRepository);
  });

  it('should return JSON string of the report', async () => {
    fileRepository.findById.mockResolvedValue(file);
    reportRepository.findByFileId.mockResolvedValue(report);

    const result = await useCase.execute({ fileId: 'file-1', userId: 'user-1' });

    const parsed = JSON.parse(result.json);
    expect(parsed.rowCount).toBe(10);
    expect(result.fileName).toContain('test');
  });

  it('should throw when user does not own file', async () => {
    fileRepository.findById.mockResolvedValue(file);
    await expect(
      useCase.execute({ fileId: 'file-1', userId: 'other-user' })
    ).rejects.toThrow('Access denied');
  });
});
