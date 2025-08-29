import { Routes } from '@angular/router';

import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { ProfileComponent } from './features/profile/profile';

import { authGuard } from './features/guards/auth.guard';
import { adminGuard } from './features/guards/admin.guard';

import { AllUsersComponent } from './features/auth/all-users/all-users';

import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';
import { EditFlatComponent } from './features/edit-flat/edit-flat';
import { MyFlatsComponent } from './features/my-flats/my-flats';
import { FavoritesComponent } from './features/favourites/favorites';

import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  // public home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // public auth pages
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // flats
  { path: 'flat/:id', component: ViewFlatComponent },                                  // PUBLIC
  { path: 'new-flat', component: NewFlatComponent, canActivate: [authGuard] },         // PROTECTED
  { path: 'flat/:id/edit', component: EditFlatComponent, canActivate: [authGuard] },   // PROTECTED
  { path: 'my-flats', component: MyFlatsComponent, canActivate: [authGuard] },         // PROTECTED

  // user
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },

  // admin
  { path: 'admin/users', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/users/:uid', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },

  // fallback
  { path: '**', redirectTo: 'home' },
];
