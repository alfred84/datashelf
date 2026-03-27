import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FileResponseDto, ReportResponseDto, RenameFileDto } from '@datashelf/shared';
import { environment } from '../../environments/environment';

/** Centralized HTTP service for file and report operations. */
@Injectable({ providedIn: 'root' })
export class FilesService {
  private readonly http = inject(HttpClient);

  async upload(file: File): Promise<FileResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    return firstValueFrom(
      this.http.post<FileResponseDto>(`${environment.apiUrl}/files`, formData)
    );
  }

  async list(): Promise<FileResponseDto[]> {
    return firstValueFrom(
      this.http.get<FileResponseDto[]>(`${environment.apiUrl}/files`)
    );
  }

  async rename(id: string, dto: RenameFileDto): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/files/${id}`, dto)
    );
  }

  async retry(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/files/${id}/retry`, {})
    );
  }

  async getReport(fileId: string): Promise<ReportResponseDto> {
    return firstValueFrom(
      this.http.get<ReportResponseDto>(
        `${environment.apiUrl}/files/${fileId}/report`
      )
    );
  }

  getReportDownloadUrl(fileId: string): string {
    return `${environment.apiUrl}/files/${fileId}/report/download`;
  }
}
