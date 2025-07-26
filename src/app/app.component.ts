import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './services/user.service';
import { Session } from '@supabase/supabase-js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cms-dashboard';
  session: Session | null = null;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only set up auth state change listener in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Subscribe to session changes
      this.authService.session$.subscribe(session => {
        this.session = session;
      });

      // Subscribe to current user changes
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  signOut() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.logout();
    }
  }

  // Helper methods for template
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserRole(): string {
    return this.currentUser?.role?.roleName|| 'No Role';
  }
}
