import { inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser ?? await new Promise<any>(resolve =>
    onAuthStateChanged(auth, u => resolve(u), () => resolve(null))
  );

  return user ? true : router.parseUrl('/login');
};
