import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import {
  CardComponent,
  ButtonComponent,
  FormFieldComponent,
  AlertComponent,
} from '../../ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    FormFieldComponent,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async onSubmit() {
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.authService.login({ email: this.email, password: this.password });
      this.router.navigate(['/files']);
    } catch (err: unknown) {
      this.error.set(this.apiErrorMessage(err, 'Login failed'));
    } finally {
      this.loading.set(false);
    }
  }

  private apiErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const msg = (body as { message: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
      if (typeof body === 'string' && body.length > 0) return body;
      return err.message || fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  }
}
