import {
  FileRepository,
  ReportRepository,
  JobQueue,
  NotFoundError,
  ForbiddenError,
} from '@datashelf/domain';

/** Input required to retry file processing. */
export interface RetryFileInput {
  fileId: string;
  userId: string;
}

/** Retries processing for a FAILED file by re-enqueueing the job. */
export class RetryFileProcessingUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly reportRepository: ReportRepository,
    private readonly jobQueue: JobQueue
  ) {}

  async execute(input: RetryFileInput): Promise<void> {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) {
      throw new NotFoundError('File', input.fileId);
    }
    if (file.userId !== input.userId) {
      throw new ForbiddenError();
    }

    await this.reportRepository.deleteByFileId(input.fileId);
    file.markQueued();
    await this.fileRepository.update(file);
    await this.jobQueue.enqueue('process-csv', { fileId: input.fileId });
  }
}
