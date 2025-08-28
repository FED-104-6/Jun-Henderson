import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Flat } from './new-flat.model';

const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class NewFlatService {
  private auth = inject(Auth);

  private genId(): string {
    const c: any = globalThis.crypto as any;
    if (c?.randomUUID) return c.randomUUID();
    return 'f_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  private load(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private save(list: Flat[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  createFlat(payload: Flat): Observable<{ id: string }> {
    const list = this.load();
    const id = this.genId();
    const now = Date.now();
    const ownerId = this.auth.currentUser?.uid;

    const record: Flat = {
      ...payload,
      id,
      ownerId,
      createdAt: now,
      updatedAt: now,
      favorites: payload.favorites ?? [],
    };

    list.push(record);
    this.save(list);
    return of({ id });
  }

  getFlat(id: string): Observable<Flat | undefined> {
    const list = this.load();
    return of(list.find(f => f.id === id));
  }

  updateFlat(id: string, patch: Partial<Flat>): Observable<void> {
    const list = this.load();
    const i = list.findIndex(f => f.id === id);
    if (i >= 0) {
      list[i] = { ...list[i], ...patch, id, updatedAt: Date.now() };
      this.save(list);
    }
    return of(void 0);
  }

  deleteFlat(id: string): Observable<void> {
    const list = this.load().filter(f => f.id !== id);
    this.save(list);
    return of(void 0);
  }

  listFlats(): Observable<Flat[]> {
    return of(this.load());
  }
}
