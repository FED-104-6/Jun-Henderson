import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' },
];
