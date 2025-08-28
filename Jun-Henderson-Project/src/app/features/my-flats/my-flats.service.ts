import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Flat } from './my-flats.model';

const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class MyFlatsService {
  private auth = inject(Auth);

  userId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  listAll(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  listMine(): Flat[] {
    const uid = this.userId();
    if (!uid) return [];
    return this.listAll().filter(f => f.ownerId === uid);
  }

  removeIfOwner(id: string): boolean {
    const uid = this.userId();
    if (!uid) return false;

    const all = this.listAll();
    const idx = all.findIndex(f => f.id === id);
    if (idx === -1) return false;

    const target = all[idx];
    if (!target.ownerId || target.ownerId !== uid) return false;

    all.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  }
}
