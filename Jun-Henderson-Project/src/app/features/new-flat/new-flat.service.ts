import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Auth } from '@angular/fire/auth';            // uses Firebase Auth uid
import { Flat } from './new-flat.model';

const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class NewFlatService {
  private auth = inject(Auth);

  createFlat(flat: Flat): Observable<Flat> {
    // generate an id and attach current user as owner (if logged in)
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    const ownerId = this.auth.currentUser?.uid ?? undefined;

    // normalize and build the record
    const record: Flat = { ...flat, id, ownerId };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Flat[] = raw ? JSON.parse(raw) : [];
      list.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[NewFlatService] Failed to persist to localStorage:', e);
    }

    // mimic async API
    return of(record).pipe(delay(500));
  }
}
