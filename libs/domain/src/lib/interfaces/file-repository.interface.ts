import { CsvFile } from '../entities/file.entity';

/** Port for file metadata persistence operations. */
export interface FileRepository {
  findById(id: string): Promise<CsvFile | null>;
  findByUserId(userId: string): Promise<CsvFile[]>;
  save(file: CsvFile): Promise<void>;
  update(file: CsvFile): Promise<void>;
}
