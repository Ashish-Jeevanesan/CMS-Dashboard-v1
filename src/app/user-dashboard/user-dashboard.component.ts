import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService, Church } from '../services/user.service';

import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  churches: Church[] = [];
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isAdmin = false;
  updatingUserId: number | null = null;
  private userService = inject(UserService);
  private authService = inject(AuthService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.loadChurches();
      this.authService.authInitialized$.subscribe(initialized => {
        if (initialized) {
          this.isAdmin = this.authService.isAdmin();
        }
      });
    }
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = null;
    
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  loadChurches() {
    this.userService.getActiveChurches().subscribe({
      next: (churches) => this.churches = churches,
      error: (error) => console.error('Error loading churches:', error)
    });
  }

  updateUserChurch(userId: number, churchId: number) {
    if (!this.isAdmin) return;
    
    this.updatingUserId = userId;
    this.errorMessage = null;
    
    this.userService.updateUserChurch(userId, churchId)
      .then(updatedUser => {
        if (updatedUser) {
          const user = this.users.find(u => u.userId === userId);
          if (user) {
            user.church = this.churches.find(c => c.churchId === updatedUser.church?.churchId);
          }
          this.successMessage = 'Church mapping updated successfully';
          setTimeout(() => this.successMessage = null, 3000);
        } else {
          this.errorMessage = 'Failed to update church mapping';
          setTimeout(() => this.errorMessage = null, 3000);
        }
      })
      .catch(error => {
        console.error('Error updating church:', error);
        this.errorMessage = 'Error updating church mapping. Please try again.';
        setTimeout(() => this.errorMessage = null, 3000);
      })
      .finally(() => {
        this.updatingUserId = null;
      });
  }
}
