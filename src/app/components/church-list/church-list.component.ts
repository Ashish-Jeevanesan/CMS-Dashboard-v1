import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ChurchService, Church } from '../../services/church.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-church-list',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './church-list.component.html',
  styleUrls: ['./church-list.component.css']
})
export class ChurchListComponent implements OnInit {
  city = '';
  state = '';
  churches: Church[] = [];
  selectedChurchId!: number;
  loading = false;
  updatingChurchId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private churchService: ChurchService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only fetch data in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.fetchChurches();
    }
  }

  async fetchChurches() {
    this.loading = true;
    const payload = {
      city: this.city,
      state: this.state
    };
    console.log('payload--> ', payload);
    try{
      const result = await this.churchService.getChurches(payload);
      if (Array.isArray(result) && result.every(item => 'id' in item && 'name' in item)) {
        this.churches = result as unknown as Church[];
      } else {
        this.churches = [];
        console.error('Error: Invalid response format from getChurches', result);
      }
    } catch (error) {
      console.error('Error fetching churches:', error);
    }
    this.loading = false;
  }

  // async approve(churchId: number) {
  //   if (churchId) {
  //     try {
  //       await this.churchService.approveChurch(churchId);
  //       // Update status locally
  //       const church = this.churches.find(c => c.id === churchId);
  //       if (church) church.status = 'Approved';
  //       alert('Church approved successfully!');
  //     } catch (error) {
  //       alert('Error approving church');
  //       console.error(error);
  //     }
  //   }
  // }

  // Check if current user can manage churches
  canManageChurches(): boolean {
    return this.authService.canManageChurches();
  }

  // Check if current user is admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Get current user info for display
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  async approveChurch(id: number, status: string) {
    // Check permissions before allowing action
    if (!this.canManageChurches()) {
      alert('You do not have permission to manage churches. Only ADMIN users can approve or rollback churches.');
      return;
    }

    try {
      this.loading = true;
      await this.churchService.approveChurch(id, status);
      const church = this.churches.find(c => c.id === id);
      if (church) {
        church.status = status;
      }
      console.log(`Church ${id} status updated to ${status} by ${this.getCurrentUser()?.role?.roleName} user`);
      
      // Show success message
      const action = status === 'Approved' ? 'approved' : 'rolled back';
      alert(`Church successfully ${action}!`);
    } catch (error) {
      console.error('Error updating church status:', error);
      alert('Failed to update church status. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  async updateChurchActive(churchId: number, event: Event) {
    if (!this.isAdmin()) {
      return;
    }

    const checkbox = event.target as HTMLInputElement;
    try {
      this.loading = true;
      await this.churchService.updateChurchActive(churchId, checkbox.checked);
      
      // Update local state
      const church = this.churches.find(c => c.id === churchId);
      if (church) {
        church.isActive = checkbox.checked;
      }
      
      console.log(`Church ${churchId} active status updated to ${checkbox.checked}`);
    } catch (error) {
      console.error('Error updating church active status:', error);
      // Revert checkbox state on error
      checkbox.checked = !checkbox.checked;
      alert('Failed to update church active status. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
