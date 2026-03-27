/** DTO for report responses returned to the client. */
export interface ReportResponseDto {
  id: string;
  fileId: string;
  rowCount: number;
  columnCount: number;
  columnNames: string[];
  columnTypes: Record<string, string>;
  emptyCountPerColumn: Record<string, number>;
  previewRows: Record<string, unknown>[];
  errorMessage: string | null;
  createdAt: string;
}
