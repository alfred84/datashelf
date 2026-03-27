import { v4 as uuidv4 } from 'uuid';
import { parse } from 'csv-parse/sync';
import {
  FileRepository,
  ReportRepository,
  FileStorageService,
  Report,
  NotFoundError,
} from '@datashelf/domain';

/** Parses a CSV file and generates a profile report. */
export class ProcessFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly reportRepository: ReportRepository,
    private readonly fileStorage: FileStorageService
  ) {}

  async execute(fileId: string): Promise<void> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError('File', fileId);
    }

    file.markProcessing();
    await this.fileRepository.update(file);

    try {
      const content = await this.fileStorage.retrieve(file.storagePath);
      const text = content.toString('utf-8').trim();

      if (!text) {
        const report = Report.create({
          id: uuidv4(),
          fileId,
          rowCount: 0,
          columnCount: 0,
          columnNames: [],
          columnTypes: {},
          emptyCountPerColumn: {},
          previewRows: [],
          createdAt: new Date(),
        });
        await this.reportRepository.save(report);
        file.markCompleted();
        await this.fileRepository.update(file);
        return;
      }

      const records: string[][] = parse(text, {
        relax_column_count: true,
        skip_empty_lines: true,
      });

      if (records.length === 0) {
        const report = Report.create({
          id: uuidv4(),
          fileId,
          rowCount: 0,
          columnCount: 0,
          columnNames: [],
          columnTypes: {},
          emptyCountPerColumn: {},
          previewRows: [],
          createdAt: new Date(),
        });
        await this.reportRepository.save(report);
        file.markCompleted();
        await this.fileRepository.update(file);
        return;
      }

      const headers = records[0];
      const dataRows = records.slice(1);
      const columnTypes: Record<string, string> = {};
      const emptyCountPerColumn: Record<string, number> = {};

      for (const header of headers) {
        columnTypes[header] = 'string';
        emptyCountPerColumn[header] = 0;
      }

      for (const row of dataRows) {
        for (let i = 0; i < headers.length; i++) {
          const val = row[i]?.trim() ?? '';
          if (val === '') {
            emptyCountPerColumn[headers[i]]++;
          }
        }
      }

      for (let i = 0; i < headers.length; i++) {
        const values = dataRows
          .map((r) => r[i]?.trim() ?? '')
          .filter((v) => v !== '');
        columnTypes[headers[i]] = this.inferType(values);
      }

      const previewRows = dataRows.slice(0, 5).map((row) => {
        const obj: Record<string, unknown> = {};
        headers.forEach((h, i) => (obj[h] = row[i] ?? ''));
        return obj;
      });

      const report = Report.create({
        id: uuidv4(),
        fileId,
        rowCount: dataRows.length,
        columnCount: headers.length,
        columnNames: headers,
        columnTypes,
        emptyCountPerColumn,
        previewRows,
        createdAt: new Date(),
      });

      await this.reportRepository.save(report);
      file.markCompleted();
      await this.fileRepository.update(file);
    } catch (error) {
      file.markFailed();
      await this.fileRepository.update(file);
      throw error;
    }
  }

  private inferType(values: string[]): string {
    if (values.length === 0) return 'string';

    const allBoolean = values.every((v) =>
      ['true', 'false', '0', '1'].includes(v.toLowerCase())
    );
    if (allBoolean) return 'boolean';

    const allNumber = values.every((v) => !isNaN(Number(v)));
    if (allNumber) return 'number';

    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    const allDate = values.every((v) => dateRegex.test(v) && !isNaN(Date.parse(v)));
    if (allDate) return 'date';

    return 'string';
  }
}
