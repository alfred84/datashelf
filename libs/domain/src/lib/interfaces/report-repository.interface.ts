import { Report } from '../entities/report.entity';

/** Port for report persistence operations. */
export interface ReportRepository {
  findByFileId(fileId: string): Promise<Report | null>;
  save(report: Report): Promise<void>;
  deleteByFileId(fileId: string): Promise<void>;
}
