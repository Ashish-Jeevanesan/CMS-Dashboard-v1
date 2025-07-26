import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChurchService, Church } from '../services/church.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  churches: Church[] = [];
  users: User[] = [];
  loading = false;
  stats = {
    totalChurches: 0,
    approvedChurches: 0,
    pendingChurches: 0,
    totalUsers: 0
  };

  constructor(
    private churchService: ChurchService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only load data in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  async loadDashboardData() {
    this.loading = true;
    try {
      // Load churches
      const churchData = await this.churchService.getChurches({ city: '', state: '' });
      this.churches = churchData;
      
      // Calculate church stats
      this.stats.totalChurches = this.churches.length;
      this.stats.approvedChurches = this.churches.filter(c => c.status === 'Approved').length;
      this.stats.pendingChurches = this.churches.filter(c => c.status !== 'Approved').length;

      // Load users
      this.userService.getUsers().subscribe({
        next: (userData: User[]) => {
          this.users = userData;
          this.stats.totalUsers = this.users.length;
        },
        error: (error: any) => {
          console.error('Error loading users:', error);
          // Continue even if users fail to load
        }
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }
}
