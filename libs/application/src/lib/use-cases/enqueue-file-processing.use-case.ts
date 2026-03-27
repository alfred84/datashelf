import {
  FileRepository,
  JobQueue,
  NotFoundError,
} from '@datashelf/domain';

/** Transitions file to QUEUED and enqueues a background processing job. */
export class EnqueueFileProcessingUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly jobQueue: JobQueue
  ) {}

  async execute(fileId: string): Promise<void> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError('File', fileId);
    }

    file.markQueued();
    await this.fileRepository.update(file);
    await this.jobQueue.enqueue('process-csv', { fileId });
  }
}
