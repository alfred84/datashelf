import {
  FileRepository,
  ReportRepository,
  NotFoundError,
  ForbiddenError,
} from '@datashelf/domain';

/** Input for downloading a report. */
export interface DownloadReportInput {
  fileId: string;
  userId: string;
}

/** Result containing the JSON string and suggested file name. */
export interface DownloadReportResult {
  json: string;
  fileName: string;
}

/** Generates a downloadable JSON representation of a file's report. */
export class DownloadReportUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly reportRepository: ReportRepository
  ) {}

  async execute(input: DownloadReportInput): Promise<DownloadReportResult> {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) {
      throw new NotFoundError('File', input.fileId);
    }
    if (file.userId !== input.userId) {
      throw new ForbiddenError();
    }

    const report = await this.reportRepository.findByFileId(input.fileId);
    if (!report) {
      throw new NotFoundError('Report', input.fileId);
    }

    const json = JSON.stringify(
      {
        rowCount: report.rowCount,
        columnCount: report.columnCount,
        columnNames: report.columnNames,
        columnTypes: report.columnTypes,
        emptyCountPerColumn: report.emptyCountPerColumn,
        previewRows: report.previewRows,
        generatedAt: report.createdAt.toISOString(),
      },
      null,
      2
    );

    const baseName = file.displayName.replace(/\.csv$/i, '');
    return { json, fileName: `${baseName}-report.json` };
  }
}
