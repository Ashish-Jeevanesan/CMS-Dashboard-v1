import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChurchService, Church } from '../services/church.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  city = '';
  state = '';
  churches: Church[] = [];
  selectedChurchId!: number;

  constructor() {}

// loadChurches() {
//     this.churchService.getChurches(this.city, this.state).subscribe(data => {
//       this.churches = data;
//     });
//   }

}
