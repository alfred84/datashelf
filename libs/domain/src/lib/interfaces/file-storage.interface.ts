/** Port for physical file storage operations. */
export interface FileStorageService {
  store(fileName: string, content: Buffer): Promise<string>;
  retrieve(storagePath: string): Promise<Buffer>;
  delete(storagePath: string): Promise<void>;
}
