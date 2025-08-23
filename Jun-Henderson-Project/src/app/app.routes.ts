import { Routes } from '@angular/router';

import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { ProfileComponent } from './features/profile/profile';
import { authGuard } from './features/guards/auth.guard';

import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';
import { EditFlatComponent } from './features/edit-flat/edit-flat';
import { canActivate } from '@angular/fire/auth-guard';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // View + edit (singular Flat)
  { path: 'new-flat', component: NewFlatComponent, canActivate: [authGuard] },
  { path: 'flat/:id', component: ViewFlatComponent },
  { path: 'flat/:id/edit', component: EditFlatComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' },
];
