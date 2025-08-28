import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Auth } from '@angular/fire/auth';            // uses Firebase Auth uid
import { Flat } from './new-flat.model';

const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class NewFlatService {
  private auth = inject(Auth);

  /** Load all flats from localStorage */
  private load(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  /** Save all flats back to localStorage */
  private save(list: Flat[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[NewFlatService] Failed to persist to localStorage:', e);
    }
  }

  /** Create a new flat and persist it */
  createFlat(flat: Flat): Observable<Flat> {
    // Generate id and attach ownerId from the logged-in user
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    const ownerId = this.auth.currentUser?.uid ?? undefined;

    // normalize and build the record
    const record: Flat = {
      ...flat,
      id,
      ownerId,
      favorites: flat.favorites ?? [],
    };

    const list = this.load();
    list.push(record);
    this.save(list);

    // mimic async API
    return of(record).pipe(delay(400));
  }
}
