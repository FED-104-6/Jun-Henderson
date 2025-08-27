import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import type { Flat } from '../view-flat/view-flat.model';

const STORAGE_KEY = 'flats';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(Auth);

  /** Get current user's email (used as the favorite marker) */
  private email(): string | null {
    return this.auth.currentUser?.email ?? null;
  }

  /** Read all flats from localStorage */
  private readAll(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  /** Write all flats back to localStorage */
  private writeAll(list: Flat[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /** Return only the favorite flats for current user (email-based) */
  listFavorites(): Flat[] {
    const email = this.email();
    if (!email) return [];
    return this.readAll().filter(f => Array.isArray(f.favorites) && f.favorites.includes(email));
  }

  /** Check if a flat is favorited by current user */
  isFavorite(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;
    const flat = this.readAll().find(f => f.id === flatId);
    return !!flat && Array.isArray(flat.favorites) && flat.favorites.includes(email);
  }

  /** Toggle favorite using the current user's email */
  toggle(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;

    const list = this.readAll();
    const idx = list.findIndex(f => f.id === flatId);
    if (idx === -1) return false;

    const target = list[idx];
    const favs = Array.isArray(target.favorites) ? [...target.favorites] : [];
    const exists = favs.includes(email);

    const nextFavs = exists ? favs.filter(e => e !== email) : [...favs, email];
    list[idx] = { ...target, favorites: nextFavs };
    this.writeAll(list);

    return !exists; // true if became favorited; false if removed
  }

  /** Remove favorite (explicit) */
  remove(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;

    const list = this.readAll();
    const idx = list.findIndex(f => f.id === flatId);
    if (idx === -1) return false;

    const target = list[idx];
    if (!Array.isArray(target.favorites)) return false;

    const nextFavs = target.favorites.filter(e => e !== email);
    list[idx] = { ...target, favorites: nextFavs };
    this.writeAll(list);
    return true;
  }
}
