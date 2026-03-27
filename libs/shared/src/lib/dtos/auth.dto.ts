/** DTO for user registration requests. */
export interface RegisterDto {
  email: string;
  password: string;
}

/** DTO for user login requests. */
export interface LoginDto {
  email: string;
  password: string;
}

/** DTO for authentication responses. */
export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}
