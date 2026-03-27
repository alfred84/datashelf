import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  UploadFileUseCase,
  ListUserFilesUseCase,
  RenameFileUseCase,
  EnqueueFileProcessingUseCase,
  RetryFileProcessingUseCase,
  GetReportUseCase,
  DownloadReportUseCase,
} from '@datashelf/application';
import {
  FileRepository,
  ReportRepository,
  FileStorageService,
  JobQueue,
  NotFoundError,
  ForbiddenError,
  DomainError,
} from '@datashelf/domain';
import {
  RenameFileDto,
  INJECTION_TOKENS,
  MAX_FILE_SIZE_BYTES,
} from '@datashelf/shared';
import { JwtAuthGuard } from '../auth/jwt.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string };
}

interface UploadedFileData {
  originalname: string;
  buffer: Buffer;
  size: number;
}

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    @Inject(INJECTION_TOKENS.FILE_REPOSITORY)
    private readonly fileRepository: FileRepository,
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(INJECTION_TOKENS.FILE_STORAGE)
    private readonly fileStorage: FileStorageService,
    @Inject(INJECTION_TOKENS.JOB_QUEUE)
    private readonly jobQueue: JobQueue
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.csv')) {
          return cb(new BadRequestException('Only CSV files are allowed'), false);
        }
        cb(null, true);
      },
    })
  )
  async upload(@Req() req: AuthRequest, @UploadedFile() file: UploadedFileData) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const uploadUseCase = new UploadFileUseCase(
        this.fileRepository,
        this.fileStorage
      );
      const result = await uploadUseCase.execute({
        userId: req.user.userId,
        originalName: file.originalname,
        content: file.buffer,
        sizeBytes: file.size,
      });

      const enqueueUseCase = new EnqueueFileProcessingUseCase(
        this.fileRepository,
        this.jobQueue
      );
      await enqueueUseCase.execute(result.id);

      return { ...result, status: 'QUEUED' };
    } catch (error) {
      this.handleDomainError(error);
    }
  }

  @Get()
  async list(@Req() req: AuthRequest) {
    const useCase = new ListUserFilesUseCase(this.fileRepository);
    return useCase.execute(req.user.userId);
  }

  @Patch(':id')
  async rename(
    @Param('id') id: string,
    @Body() dto: RenameFileDto,
    @Req() req: AuthRequest
  ) {
    try {
      const useCase = new RenameFileUseCase(this.fileRepository);
      await useCase.execute({
        fileId: id,
        userId: req.user.userId,
        displayName: dto.displayName,
      });
      return { success: true };
    } catch (error) {
      this.handleDomainError(error);
    }
  }

  @Post(':id/retry')
  async retry(@Param('id') id: string, @Req() req: AuthRequest) {
    try {
      const useCase = new RetryFileProcessingUseCase(
        this.fileRepository,
        this.reportRepository,
        this.jobQueue
      );
      await useCase.execute({ fileId: id, userId: req.user.userId });
      return { success: true };
    } catch (error) {
      this.handleDomainError(error);
    }
  }

  @Get(':id/report')
  async getReport(@Param('id') id: string, @Req() req: AuthRequest) {
    try {
      const useCase = new GetReportUseCase(
        this.fileRepository,
        this.reportRepository
      );
      return useCase.execute({ fileId: id, userId: req.user.userId });
    } catch (error) {
      this.handleDomainError(error);
    }
  }

  @Get(':id/report/download')
  async downloadReport(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Res() res: Response
  ) {
    try {
      const useCase = new DownloadReportUseCase(
        this.fileRepository,
        this.reportRepository
      );
      const result = await useCase.execute({
        fileId: id,
        userId: req.user.userId,
      });

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.fileName}"`
      );
      res.send(result.json);
    } catch (error) {
      this.handleDomainError(error);
    }
  }

  private handleDomainError(error: unknown): never {
    if (error instanceof NotFoundError) {
      throw new NotFoundException(error.message);
    }
    if (error instanceof ForbiddenError) {
      throw new ForbiddenException(error.message);
    }
    if (error instanceof DomainError) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}
