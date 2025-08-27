import { Routes } from '@angular/router';

import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { ProfileComponent } from './features/profile/profile';
import { authGuard } from './features/guards/auth.guard';

import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';
import { EditFlatComponent } from './features/edit-flat/edit-flat';
import { MyFlatsComponent } from './features/my-flats/my-flats';
import { FavoritesComponent } from './features/favourites/favorites';

export const routes: Routes = [
  // public
  { path: '', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // flats
  { path: 'flat/:id', component: ViewFlatComponent },                                  // PUBLIC
  { path: 'new-flat', component: NewFlatComponent, canActivate: [authGuard] },         // PROTECTED
  { path: 'flat/:id/edit', component: EditFlatComponent, canActivate: [authGuard] },   // PROTECTED
  { path: 'my-flats', component: MyFlatsComponent, canActivate: [authGuard] },         // PROTECTED
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },

  // temporary until real Home exists
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: '**', redirectTo: '' },
];
