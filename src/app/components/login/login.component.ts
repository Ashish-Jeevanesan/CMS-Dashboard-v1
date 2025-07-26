import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Always clear any existing session/user state on login page load
    this.authService.logout();
  }

  // Input validation methods
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6; // Minimum 6 characters
  }

  validateForm(): string | null {
    if (!this.email.trim()) {
      return 'Email is required';
    }
    if (!this.isValidEmail(this.email)) {
      return 'Please enter a valid email address';
    }
    if (!this.password.trim()) {
      return 'Password is required';
    }
    if (!this.isValidPassword(this.password)) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  }

  async handleLogin() {
    try {
      this.loading = true;
      this.errorMessage = null;

      // Client-side validation
      const validationError = this.validateForm();
      if (validationError) {
        this.errorMessage = validationError;
        return;
      }

      // Sanitize inputs
      const sanitizedEmail = this.email.trim().toLowerCase();
      const sanitizedPassword = this.password.trim();

      const { error } = await this.authService.login(sanitizedEmail, sanitizedPassword);
      if (error) {
        // Handle specific error types
        switch (error.message) {
          case 'Invalid login credentials':
            this.errorMessage = 'Invalid email or password. Please try again.';
            break;
          case 'Email not confirmed':
            this.errorMessage = 'Please check your email and confirm your account.';
            break;
          case 'Supabase not initialized':
            this.errorMessage = 'Authentication service is not available. Please refresh the page and try again.';
            break;
          default:
            this.errorMessage = error.message;
        }
      } else {
        // Wait for user to be set, but timeout after 5 seconds
        const timeout = new Promise((_, reject) => setTimeout(() => reject('Timeout waiting for user'), 5000));
        try {
          const user = await Promise.race([
            this.authService.currentUser$.pipe(
              filter(u => !!u),
              take(1)
            ).toPromise(),
            timeout
          ]);
          if (!user) {
            this.errorMessage = 'Account not found. Please contact support.';
            await this.authService.logout();
            return;
          }
          this.router.navigate(['/dashboard']);
        } catch (err) {
          this.errorMessage = 'Failed to fetch user details. Please check your account or contact support.';
          await this.authService.logout();
          console.error('Login error:', err);
        }
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
      console.error('Login error:', error);
    } finally {
      this.loading = false;
    }
  }
}
