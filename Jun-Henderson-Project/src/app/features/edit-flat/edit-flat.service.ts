import { Injectable } from '@angular/core';
import { Flat } from './edit-flat.model';

// Local
const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class EditFlatService {
  // Load one flat by id (or null if not found).
  get(id: string): Flat | null {
    return this.#load().find(f => f.id === id) ?? null;
  }

  // Update an existing flat (by id) with a partial patch.
  // Returns the updated record or null if not found.
update(id: string, patch: Partial<Flat>): Flat | null {
  const list = this.#load();
  const idx = list.findIndex(f => f.id === id);
  if (idx === -1) return null;

  const updated: Flat = { ...list[idx], ...patch };
  list[idx] = updated;
  this.#save(list);
  return updated;
}


  // -------- internals --------
  #load(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  #save(list: Flat[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}
