import { CsvFile, MAX_FILE_SIZE } from './file.entity';
import { FileStatus } from '../value-objects/file-status.vo';

describe('CsvFile Entity', () => {
  const validProps = {
    id: 'file-uuid',
    userId: 'user-uuid',
    originalName: 'data.csv',
    displayName: 'data.csv',
    storagePath: '/uploads/data.csv',
    sizeBytes: 1024,
    status: FileStatus.UPLOADED,
    uploadedAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid CSV file', () => {
    const file = CsvFile.create(validProps);
    expect(file.id).toBe('file-uuid');
    expect(file.status).toBe(FileStatus.UPLOADED);
  });

  it('should reject files exceeding max size', () => {
    expect(() =>
      CsvFile.create({ ...validProps, sizeBytes: MAX_FILE_SIZE + 1 })
    ).toThrow('File exceeds maximum size');
  });

  it('should reject non-CSV files', () => {
    expect(() =>
      CsvFile.create({ ...validProps, originalName: 'data.txt' })
    ).toThrow('Only CSV files are allowed');
  });

  it('should reject empty id', () => {
    expect(() => CsvFile.create({ ...validProps, id: '' })).toThrow(
      'File id is required'
    );
  });

  describe('rename', () => {
    it('should update display name', () => {
      const file = CsvFile.create(validProps);
      file.rename('renamed.csv');
      expect(file.displayName).toBe('renamed.csv');
    });

    it('should reject empty name', () => {
      const file = CsvFile.create(validProps);
      expect(() => file.rename('')).toThrow('Display name cannot be empty');
    });
  });

  describe('status transitions', () => {
    it('should transition UPLOADED -> QUEUED', () => {
      const file = CsvFile.create(validProps);
      file.markQueued();
      expect(file.status).toBe(FileStatus.QUEUED);
    });

    it('should transition QUEUED -> PROCESSING', () => {
      const file = CsvFile.create({ ...validProps, status: FileStatus.QUEUED });
      file.markProcessing();
      expect(file.status).toBe(FileStatus.PROCESSING);
    });

    it('should transition PROCESSING -> COMPLETED', () => {
      const file = CsvFile.create({ ...validProps, status: FileStatus.PROCESSING });
      file.markCompleted();
      expect(file.status).toBe(FileStatus.COMPLETED);
    });

    it('should transition PROCESSING -> FAILED', () => {
      const file = CsvFile.create({ ...validProps, status: FileStatus.PROCESSING });
      file.markFailed();
      expect(file.status).toBe(FileStatus.FAILED);
    });

    it('should transition FAILED -> QUEUED (retry)', () => {
      const file = CsvFile.create({ ...validProps, status: FileStatus.FAILED });
      file.markQueued();
      expect(file.status).toBe(FileStatus.QUEUED);
    });

    it('should reject invalid transition COMPLETED -> QUEUED', () => {
      const file = CsvFile.create({ ...validProps, status: FileStatus.COMPLETED });
      expect(() => file.markQueued()).toThrow('Cannot queue file with status COMPLETED');
    });

    it('should reject invalid transition UPLOADED -> PROCESSING', () => {
      const file = CsvFile.create(validProps);
      expect(() => file.markProcessing()).toThrow(
        'Cannot process file with status UPLOADED'
      );
    });
  });
});
