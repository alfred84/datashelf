import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthResponseDto, RegisterDto, LoginDto } from '@datashelf/shared';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'datashelf_token';
const EMAIL_KEY = 'datashelf_email';

/** Manages authentication state and API calls. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  userEmail = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  private readonly http = inject(HttpClient);

  async register(dto: RegisterDto): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, dto)
    );
  }

  async login(dto: LoginDto): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponseDto>(`${environment.apiUrl}/auth/login`, dto)
    );
    this.token.set(response.accessToken);
    this.userEmail.set(response.user.email);
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(EMAIL_KEY, response.user.email);
  }

  logout(): void {
    this.token.set(null);
    this.userEmail.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
