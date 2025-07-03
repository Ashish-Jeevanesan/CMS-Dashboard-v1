import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChurchListComponent } from './components/church-list/church-list.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

export const routes: Routes = [
  //{  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'churches', component: ChurchListComponent },
  { path: 'users', component: UserDashboardComponent },  
    { path: 'roles', component: ChurchListComponent }, 
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];
