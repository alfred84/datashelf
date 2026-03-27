import { PrismaClient } from '../../generated/prisma/client';
import { Report, ReportRepository } from '@datashelf/domain';

/** Prisma-based implementation of ReportRepository. */
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByFileId(fileId: string): Promise<Report | null> {
    const record = await this.prisma.report.findUnique({
      where: { fileId },
    });
    if (!record) return null;
    return Report.create({
      id: record.id,
      fileId: record.fileId,
      rowCount: record.rowCount,
      columnCount: record.columnCount,
      columnNames: record.columnNames as string[],
      columnTypes: record.columnTypes as Record<string, string>,
      emptyCountPerColumn: record.emptyCountPerColumn as Record<string, number>,
      previewRows: record.previewRows as Record<string, unknown>[],
      errorMessage: record.errorMessage,
      createdAt: record.createdAt,
    });
  }

  async save(report: Report): Promise<void> {
    await this.prisma.report.create({
      data: {
        id: report.id,
        fileId: report.fileId,
        rowCount: report.rowCount,
        columnCount: report.columnCount,
        columnNames: JSON.parse(JSON.stringify(report.columnNames)),
        columnTypes: JSON.parse(JSON.stringify(report.columnTypes)),
        emptyCountPerColumn: JSON.parse(JSON.stringify(report.emptyCountPerColumn)),
        previewRows: JSON.parse(JSON.stringify(report.previewRows)),
        errorMessage: report.errorMessage,
        createdAt: report.createdAt,
      },
    });
  }

  async deleteByFileId(fileId: string): Promise<void> {
    await this.prisma.report.deleteMany({ where: { fileId } });
  }
}
