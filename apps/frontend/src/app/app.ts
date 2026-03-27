import { Component, computed, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoggedIn = computed(() => !!this.authService.token());
  userEmail = computed(() => this.authService.userEmail());

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
