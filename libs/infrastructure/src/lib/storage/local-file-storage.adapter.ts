import * as fs from 'fs';
import * as path from 'path';
import { FileStorageService } from '@datashelf/domain';

/** Local filesystem implementation of FileStorageService. */
export class LocalFileStorageAdapter implements FileStorageService {
  constructor(private readonly uploadDir: string) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async store(fileName: string, content: Buffer): Promise<string> {
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  async retrieve(storagePath: string): Promise<Buffer> {
    return fs.readFileSync(storagePath);
  }

  async delete(storagePath: string): Promise<void> {
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
  }
}
