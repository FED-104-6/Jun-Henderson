import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';
import { EditFlatComponent } from './features/edit-flat/edit-flat';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-flat', component: NewFlatComponent },

  // View + Edit (singular: flat)
  { path: 'flat/:id', component: ViewFlatComponent },
  { path: 'flat/:id/edit', component: EditFlatComponent },

  { path: '**', redirectTo: '' },
];
