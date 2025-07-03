import { Component } from '@angular/core';
import { ChurchService, Church } from '../../services/church.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-church-list',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './church-list.component.html',
  styleUrl: './church-list.component.css'
})
export class ChurchListComponent {
city = '';
  state = '';
  churches: Church[] = [];
  selectedChurchId!: number;

  constructor(private churchService: ChurchService) {}

  loadChurches() {
    const payload = {
      city: this.city,
      state: this.state
    };
    console.log('payload--> ', payload);
    this.churchService.getChurches(payload).subscribe(data => {
      this.churches = data;
    });
  }

  approve(churchId: number) {
    if (churchId) {
      this.churchService.approveChurch(churchId).subscribe(() => {
        alert('Church approved successfully!');
      });
    }
  }
}
