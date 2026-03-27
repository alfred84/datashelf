/** Port for asynchronous job enqueueing. */
export interface JobQueue {
  enqueue(jobName: string, data: Record<string, unknown>): Promise<void>;
}
