import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FilesService } from '../../core/files.service';
import { AuthService } from '../../core/auth.service';
import { ReportResponseDto } from '@datashelf/shared';
import {
  PageContainerComponent,
  CardComponent,
  ButtonComponent,
  LoadingSpinnerComponent,
  AlertComponent,
} from '../../ui';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageContainerComponent,
    CardComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    AlertComponent,
  ],
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  report = signal<ReportResponseDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  fileId = '';

  private readonly route = inject(ActivatedRoute);
  private readonly filesService = inject(FilesService);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.fileId = this.route.snapshot.params['id'];
    this.loadReport();
  }

  async loadReport() {
    this.loading.set(true);
    try {
      const report = await this.filesService.getReport(this.fileId);
      this.report.set(report);
    } catch (err: unknown) {
      this.error.set(this.apiErrorMessage(err, 'Failed to load report'));
    } finally {
      this.loading.set(false);
    }
  }

  async downloadReport() {
    const token = this.authService.token();
    const url = this.filesService.getReportDownloadUrl(this.fileId);
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `report-${this.fileId}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err: unknown) {
      this.error.set(
        err instanceof Error ? err.message : 'Download failed',
      );
    }
  }

  objectKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }

  private apiErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const msg = (body as { message: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
      if (typeof body === 'string' && body.length > 0) return body;
      return err.message || fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  }
}
