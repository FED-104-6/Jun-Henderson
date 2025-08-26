import { inject, Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { AppUser, UserType } from '../models/user.entity';

@Injectable({ providedIn: 'root' })
export class UserService {
  private db = inject(Firestore);

  async listAll(): Promise<AppUser[]> {
    const ref = collection(this.db, 'users');
    const q = query(ref, orderBy('firstName'), orderBy('lastName'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as AppUser[];
  }

  async setAdmin(userId: string, isAdmin: boolean): Promise<void> {
    await updateDoc(doc(this.db, 'users', userId), { isAdmin, updatedAt: Date.now() });
  }

  async removeUser(userId: string): Promise<void> {
    await deleteDoc(doc(this.db, 'users', userId));
  }
}
