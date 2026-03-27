import { FileStatus } from '../value-objects/file-status.vo';

/** Properties required to construct a CsvFile entity. */
export interface CsvFileProps {
  id: string;
  userId: string;
  originalName: string;
  displayName: string;
  storagePath: string;
  sizeBytes: number;
  status: FileStatus;
  uploadedAt: Date;
  updatedAt: Date;
}

/** Maximum allowed file size in bytes (25 MB). */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** Domain entity representing an uploaded CSV file. */
export class CsvFile {
  readonly id: string;
  readonly userId: string;
  readonly originalName: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly uploadedAt: Date;

  private _displayName: string;
  private _status: FileStatus;
  private _updatedAt: Date;

  private constructor(props: CsvFileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.originalName = props.originalName;
    this._displayName = props.displayName;
    this.storagePath = props.storagePath;
    this.sizeBytes = props.sizeBytes;
    this._status = props.status;
    this.uploadedAt = props.uploadedAt;
    this._updatedAt = props.updatedAt;
  }

  get displayName(): string {
    return this._displayName;
  }

  get status(): FileStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /** Factory method with input validation. */
  static create(props: CsvFileProps): CsvFile {
    if (!props.id) throw new Error('File id is required');
    if (!props.userId) throw new Error('User id is required');
    if (props.sizeBytes > MAX_FILE_SIZE) {
      throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE} bytes`);
    }
    if (!props.originalName.toLowerCase().endsWith('.csv')) {
      throw new Error('Only CSV files are allowed');
    }
    return new CsvFile(props);
  }

  /** Update display name without altering the original file. */
  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Display name cannot be empty');
    }
    this._displayName = newName.trim();
    this._updatedAt = new Date();
  }

  /** Transition status to QUEUED. Only valid from UPLOADED or FAILED. */
  markQueued(): void {
    if (this._status !== FileStatus.UPLOADED && this._status !== FileStatus.FAILED) {
      throw new Error(`Cannot queue file with status ${this._status}`);
    }
    this._status = FileStatus.QUEUED;
    this._updatedAt = new Date();
  }

  /** Transition status to PROCESSING. Only valid from QUEUED. */
  markProcessing(): void {
    if (this._status !== FileStatus.QUEUED) {
      throw new Error(`Cannot process file with status ${this._status}`);
    }
    this._status = FileStatus.PROCESSING;
    this._updatedAt = new Date();
  }

  /** Transition status to COMPLETED. Only valid from PROCESSING. */
  markCompleted(): void {
    if (this._status !== FileStatus.PROCESSING) {
      throw new Error(`Cannot complete file with status ${this._status}`);
    }
    this._status = FileStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  /** Transition status to FAILED. Only valid from PROCESSING. */
  markFailed(): void {
    if (this._status !== FileStatus.PROCESSING) {
      throw new Error(`Cannot fail file with status ${this._status}`);
    }
    this._status = FileStatus.FAILED;
    this._updatedAt = new Date();
  }
}
