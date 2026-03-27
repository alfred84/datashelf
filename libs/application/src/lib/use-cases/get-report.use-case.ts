import {
  FileRepository,
  ReportRepository,
  NotFoundError,
  ForbiddenError,
} from '@datashelf/domain';
import { ReportResponseDto } from '@datashelf/shared';

/** Input for retrieving a report. */
export interface GetReportInput {
  fileId: string;
  userId: string;
}

/** Retrieves the generated report for a given file, with access control. */
export class GetReportUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly reportRepository: ReportRepository
  ) {}

  async execute(input: GetReportInput): Promise<ReportResponseDto> {
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

    return {
      id: report.id,
      fileId: report.fileId,
      rowCount: report.rowCount,
      columnCount: report.columnCount,
      columnNames: report.columnNames,
      columnTypes: report.columnTypes,
      emptyCountPerColumn: report.emptyCountPerColumn,
      previewRows: report.previewRows,
      errorMessage: report.errorMessage,
      createdAt: report.createdAt.toISOString(),
    };
  }
}
