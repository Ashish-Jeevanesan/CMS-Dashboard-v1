import { Component, OnInit } from '@angular/core';
import { ChurchService, Church } from '../../services/church.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private churchService: ChurchService) {}

  ngOnInit() {
    this.fetchChurches();
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

  async approveChurch(id: number, status: string) {
    await this.churchService.approveChurch(id, status);
    const church = this.churches.find(c => c.id === id);
    if (church) church.status = status;
  }
}
