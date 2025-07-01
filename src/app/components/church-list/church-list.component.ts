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
    this.churchService.getChurches(this.city, this.state).subscribe(data => {
      this.churches = data;
    });
  }

  approve() {
    if (this.selectedChurchId) {
      this.churchService.approveChurch(this.selectedChurchId).subscribe(() => {
        alert('Church approved successfully!');
      });
    }
  }
}
