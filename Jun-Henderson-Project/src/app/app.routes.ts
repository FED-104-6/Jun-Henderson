import { Routes } from '@angular/router';

import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { AllUsersComponent } from './features/auth/all-users/all-users';

import { HomeComponent } from './features/home/home';

import { NewFlatComponent } from './features/new-flat/new-flat';
import { ViewFlatComponent } from './features/view-flat/view-flat';
import { EditFlatComponent } from './features/edit-flat/edit-flat';
import { MyFlatsComponent } from './features/my-flats/my-flats';
import { FavoritesComponent } from './features/favourites/favorites';
import { ProfileComponent } from './features/profile/profile';

import { authGuard } from './features/guards/auth.guard';
import { adminGuard } from './features/guards/admin.guards';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'new-flat', component: NewFlatComponent, canActivate: [authGuard] },
  { path: 'my-flats', component: MyFlatsComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'flat/:id/edit', component: EditFlatComponent, canActivate: [authGuard] },
  { path: 'flat/:id', component: ViewFlatComponent },

  { path: 'admin/users', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/users/:uid', component: AllUsersComponent, canActivate: [authGuard, adminGuard] },

  { path: '**', redirectTo: 'home' },
];
