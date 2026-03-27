import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { RegisterUserUseCase, LoginUserUseCase } from '@datashelf/application';
import {
  UserRepository,
  PasswordHasher,
  TokenService,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  DomainError,
} from '@datashelf/domain';
import { RegisterDto, LoginDto, INJECTION_TOKENS } from '@datashelf/shared';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(INJECTION_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(INJECTION_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const useCase = new RegisterUserUseCase(
        this.userRepository,
        this.passwordHasher
      );
      const result = await useCase.execute(dto);
      return result;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof DomainError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    try {
      const useCase = new LoginUserUseCase(
        this.userRepository,
        this.passwordHasher,
        this.tokenService
      );
      return await useCase.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof DomainError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
