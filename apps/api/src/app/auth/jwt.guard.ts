import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { TokenService } from '@datashelf/domain';
import { INJECTION_TOKENS } from '@datashelf/shared';

/** Guard that validates JWT tokens on protected routes. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(INJECTION_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    try {
      const payload = this.tokenService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
