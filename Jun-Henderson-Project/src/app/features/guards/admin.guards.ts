import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(Auth);
  const db = inject(Firestore);
  const u = auth.currentUser;
  if (!u) return router.createUrlTree(['/login']);
  const snap = await getDoc(doc(db, 'users', u.uid));
  const data = snap.data() as any | undefined;
  if (data?.isAdmin) return true;
  return router.createUrlTree(['/login']);
};
