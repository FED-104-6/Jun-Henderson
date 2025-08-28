import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flat } from './new-flat.model';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class NewFlatService {
  private storageKey = 'flats';
  private auth = inject(Auth);

  private genId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID();
    return 'f_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  private load(): Flat[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as Flat[] : [];
  }

  private save(list: Flat[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  createFlat(payload: Flat): Observable<{ id: string }> {
    const list = this.load();
    const id = this.genId();
    const now = Date.now();
    const ownerId = this.auth.currentUser?.uid;
    const item: Flat = { ...payload, id, ownerId, createdAt: now, updatedAt: now };
    list.push(item);
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
