import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChurchListComponent } from './components/church-list/church-list.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'churches',
    component: ChurchListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'roles',
    component: UserDashboardComponent, // TODO: Create proper RolesComponent
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

