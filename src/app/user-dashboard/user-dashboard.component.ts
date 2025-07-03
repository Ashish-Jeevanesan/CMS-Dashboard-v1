import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
users: User[] = [];
private userService = inject(UserService);
//constructor(private userService: UserService) {}

ngOnInit() {
  this.loadUsers();
}

loadUsers() {
  this.userService.getUsers().subscribe(data => {
    this.users = data;
  });
}
}
