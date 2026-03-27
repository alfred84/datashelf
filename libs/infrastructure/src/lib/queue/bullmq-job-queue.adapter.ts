import { Queue } from 'bullmq';
import { JobQueue } from '@datashelf/domain';

/** BullMQ-based implementation of JobQueue. */
export class BullMQJobQueueAdapter implements JobQueue {
  private readonly queue: Queue;

  constructor(redisHost: string, redisPort: number) {
    this.queue = new Queue('datashelf-jobs', {
      connection: { host: redisHost, port: redisPort },
    });
  }

  async enqueue(jobName: string, data: Record<string, unknown>): Promise<void> {
    await this.queue.add(jobName, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
