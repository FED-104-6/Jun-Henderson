import { Injectable } from '@angular/core';
import { Flat } from './view-flat.model';

// Read-only service for View Flat. It reads from localStorage.
// Must live in: src/app/features/view-flat/view-flat-service.ts
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
}
