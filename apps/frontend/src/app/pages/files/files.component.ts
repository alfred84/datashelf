import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FilesService } from '../../core/files.service';
import { FileResponseDto } from '@datashelf/shared';
import {
  PageContainerComponent,
  CardComponent,
  StatusBadgeComponent,
  EmptyStateComponent,
  AlertComponent,
} from '../../ui';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageContainerComponent,
    CardComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    AlertComponent,
  ],
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit, OnDestroy {
  files = signal<FileResponseDto[]>([]);
  loading = signal(false);
  uploading = signal(false);
  error = signal<string | null>(null);
  editingId = signal<string | null>(null);
  editName = '';
  searchQuery = signal('');
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  private readonly filesService = inject(FilesService);

  ngOnInit() {
    this.loadFiles();
    this.pollInterval = setInterval(() => this.loadFiles(), 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  async loadFiles() {
    try {
      const files = await this.filesService.list();
      this.files.set(files);
    } catch {
      /* polling failure is silent */
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error.set(null);
    this.uploading.set(true);
    try {
      await this.filesService.upload(file);
      await this.loadFiles();
    } catch (err: unknown) {
      this.error.set(this.apiErrorMessage(err, 'Upload failed'));
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }

  startRename(file: FileResponseDto) {
    this.editingId.set(file.id);
    this.editName = file.displayName;
  }

  async saveRename(id: string) {
    try {
      await this.filesService.rename(id, { displayName: this.editName });
      this.editingId.set(null);
      await this.loadFiles();
    } catch (err: unknown) {
      this.error.set(this.apiErrorMessage(err, 'Rename failed'));
    }
  }

  cancelRename() {
    this.editingId.set(null);
  }

  async retryFile(id: string) {
    try {
      await this.filesService.retry(id);
      await this.loadFiles();
    } catch (err: unknown) {
      this.error.set(this.apiErrorMessage(err, 'Retry failed'));
    }
  }

  filteredFiles() {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.files();
    return this.files().filter(
      (f) =>
        f.displayName.toLowerCase().includes(query) ||
        f.originalName.toLowerCase().includes(query)
    );
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
