/** Payload encoded within the authentication token. */
export interface TokenPayload {
  userId: string;
  email: string;
}

/** Port for JWT token generation and verification. */
export interface TokenService {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
