import { Worker } from 'bullmq';
import {
  getPrismaClient,
  PrismaFileRepository,
  PrismaReportRepository,
  LocalFileStorageAdapter,
} from '@datashelf/infrastructure';
import { ProcessFileUseCase } from '@datashelf/application';

const redisHost = process.env['REDIS_HOST'] || 'localhost';
const redisPort = parseInt(process.env['REDIS_PORT'] || '6379', 10);
const uploadDir = process.env['UPLOAD_DIR'] || './uploads';

const prisma = getPrismaClient();
const fileRepository = new PrismaFileRepository(prisma);
const reportRepository = new PrismaReportRepository(prisma);
const fileStorage = new LocalFileStorageAdapter(uploadDir);

const worker = new Worker(
  'datashelf-jobs',
  async (job) => {
    if (job.name === 'process-csv') {
      const { fileId } = job.data;
      console.log(`Processing file: ${fileId}`);
      const useCase = new ProcessFileUseCase(
        fileRepository,
        reportRepository,
        fileStorage
      );
      await useCase.execute(fileId);
      console.log(`File processed successfully: ${fileId}`);
    }
  },
  {
    connection: { host: redisHost, port: redisPort },
    concurrency: 2,
  }
);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

console.log('Worker started, waiting for jobs...');
