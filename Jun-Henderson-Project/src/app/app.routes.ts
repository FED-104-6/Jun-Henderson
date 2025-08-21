import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-flat', component: NewFlatComponent },
  {path: 'view-flat/:id', component: ViewFlatComponent },
  { path: '**', redirectTo: '' },
];
