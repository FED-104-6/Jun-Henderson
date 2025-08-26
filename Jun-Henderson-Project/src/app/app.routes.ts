import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './features/guards/auth.guard';
import { adminGuard } from './features/guards/admin.guards';
import { AllUsersComponent } from './features/auth/all-users/all-users';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // ProfileComponent is not yet implemented
  { path: 'admin/users', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/users/:uid', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' },
];
