import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);
  return authState(auth).pipe(
    take(1),
    map(user => user ? true : router.createUrlTree(['/login']))
  );
};
