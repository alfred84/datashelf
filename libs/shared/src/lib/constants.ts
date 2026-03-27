/** Maximum file size in bytes (25 MB). */
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

/** Allowed file extension. */
export const ALLOWED_FILE_EXTENSION = '.csv';

/** Minimum password length. */
export const MIN_PASSWORD_LENGTH = 8;

/** Injection tokens for dependency inversion. */
export const INJECTION_TOKENS = {
  USER_REPOSITORY: 'USER_REPOSITORY',
  FILE_REPOSITORY: 'FILE_REPOSITORY',
  REPORT_REPOSITORY: 'REPORT_REPOSITORY',
  FILE_STORAGE: 'FILE_STORAGE',
  PASSWORD_HASHER: 'PASSWORD_HASHER',
  TOKEN_SERVICE: 'TOKEN_SERVICE',
  JOB_QUEUE: 'JOB_QUEUE',
} as const;
