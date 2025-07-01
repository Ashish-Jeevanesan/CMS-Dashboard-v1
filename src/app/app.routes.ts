import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChurchListComponent } from './components/church-list/church-list.component';

export const routes: Routes = [
  //{  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'churches', component: ChurchListComponent },
  { path: 'users', component: ChurchListComponent },  
    { path: 'roles', component: ChurchListComponent }, 
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];
