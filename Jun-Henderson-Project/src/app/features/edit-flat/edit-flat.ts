import { Injectable } from '@angular/core';
import { Flat } from './flat.model'; 

// Local storage key (shared with New Flat)
const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class ViewFlatService {
  list(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  get(id: string): Flat | null {
    return this.list().find(f => f.id === id) ?? null;
  }

  // --- added: update support for Edit Flat ---
  // NOTE: This updates the item in localStorage and returns the updated record.
  update(id: string, patch: Partial<Flat>): Flat | null {
    try {
      const all = this.list();
      const idx = all.findIndex(f => f.id === id);
      if (idx === -1) return null;

      const updated: Flat = { ...all[idx], ...patch };
      all[idx] = updated;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return updated;
    } catch {
      return null;
    }
  }
}
