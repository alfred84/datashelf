import * as jwt from 'jsonwebtoken';
import { TokenService, TokenPayload } from '@datashelf/domain';

/** JWT-based implementation of TokenService. */
export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds = 86400
  ) {}

  generate(payload: TokenPayload): string {
    return jwt.sign(
      { userId: payload.userId, email: payload.email },
      this.secret,
      { expiresIn: this.expiresInSeconds }
    );
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret) as Record<string, unknown>;
    return {
      userId: decoded['userId'] as string,
      email: decoded['email'] as string,
    };
  }
}
