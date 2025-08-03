import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService, Church, AccessMap, AccessPermissions } from '../services/user.service';
import { AccessDialogComponent } from '../components/access-dialog/access-dialog.component';

import { AuthService } from '../services/auth.service';

const DEFAULT_MODULES = ['sermons', 'announcements', 'events'];
const DEFAULT_PERMISSIONS = { read: false, write: false, delete: false };

function ensureAccessMap(map: AccessMap | undefined | null): AccessMap {
  const result: AccessMap = {};
  for (const module of DEFAULT_MODULES) {
    result[module] = map?.[module] || { ...DEFAULT_PERMISSIONS };
  }
  return result;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AccessDialogComponent],
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
  showAccessDialog = false;
  selectedUserAccess: AccessMap | undefined;
  selectedUserId: number | null = null;
  editAccessUserId: number | null = null;
  editableAccessMap: AccessMap | null = null;

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
        this.users = data.map(user => ({
          ...user,
          accessMap: ensureAccessMap(user.accessMap)
        }));
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

  startEditAccess(user: User) {
    this.editAccessUserId = user.userId;
    this.editableAccessMap = ensureAccessMap(user.accessMap);
  }

  cancelEditAccess() {
    this.editAccessUserId = null;
    this.editableAccessMap = null;
  }

  saveAccessMap(user: User) {
    if (!this.editableAccessMap) return;
    this.userService.updateUserAccess(user.userId, this.editableAccessMap)
      .then(() => {
        user.accessMap = JSON.parse(JSON.stringify(this.editableAccessMap));
        this.successMessage = 'Access permissions updated!';
        setTimeout(() => this.successMessage = null, 2000);
        this.cancelEditAccess();
      })
      .catch(err => {
        this.errorMessage = 'Failed to update access permissions.';
        setTimeout(() => this.errorMessage = null, 2000);
      });
  }

  togglePermission(module: keyof AccessMap, perm: keyof AccessPermissions) {
    if (!this.editableAccessMap) return;
    this.editableAccessMap[module][perm] = !this.editableAccessMap[module][perm];
  }

  closeAccessDialog() {
    this.showAccessDialog = false;
  }

  saveAccessChanges(updatedAccessMap: AccessMap) {
    // Implement logic to update the user's access map
    // For example:
    this.selectedUserAccess = updatedAccessMap;
    this.showAccessDialog = false;
    // Possibly call a service to persist the changes
  }
}
