import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { NewFlatComponent } from './features/new-flat/new-flat';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-flat', component: NewFlatComponent },
  { path: '**', redirectTo: '' },
];
