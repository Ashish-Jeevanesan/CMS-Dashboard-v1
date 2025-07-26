import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage: string | null = null;
  private userService = inject(UserService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only load data in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
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
}
