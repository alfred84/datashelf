/** DTO for file responses returned to the client. */
export interface FileResponseDto {
  id: string;
  originalName: string;
  displayName: string;
  sizeBytes: number;
  status: string;
  uploadedAt: string;
  updatedAt: string;
}

/** DTO for rename requests. */
export interface RenameFileDto {
  displayName: string;
}
