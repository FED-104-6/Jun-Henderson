import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import type { Flat } from '../view-flat/view-flat.model';

const STORAGE_KEY = 'flats';

// Local helper type so this service works even if Flat doesn't declare "favorites"
type FlatWithFav = Flat & { favorites?: string[] };

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(Auth);

  /** Current user's email (used as the favorite marker) */
  private email(): string | null {
    return this.auth.currentUser?.email ?? null;
  }

  /** Safe read: parse localStorage and normalize to always have an array for favorites */
  private readAll(): FlatWithFav[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      // ensure favorites is an array for each item
      return parsed.map((it: any) => {
        const favs: string[] = Array.isArray(it?.favorites) ? it.favorites : [];
        return { ...(it as Flat), favorites: favs };
      });
    } catch {
      return [];
    }
  }

  /** Write back to localStorage */
  private writeAll(list: FlatWithFav[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /** Return only the favorites of the current user (email-based) */
  listFavorites(): FlatWithFav[] {
    const email = this.email();
    if (!email) return [];
    return this.readAll().filter(f => Array.isArray(f.favorites) && f.favorites!.includes(email));
  }

  /** Is a given flat favorited by the current user? */
  isFavorite(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;
    const flat = this.readAll().find(f => f.id === flatId);
    return !!flat && Array.isArray(flat.favorites) && flat.favorites!.includes(email);
  }

  /** Toggle favorite using the current user's email (add/remove) */
  toggle(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;

    const list = this.readAll();
    const idx = list.findIndex(f => f.id === flatId);
    if (idx === -1) return false;

    const cur = list[idx];
    const favs = Array.isArray(cur.favorites) ? [...cur.favorites] : [];
    const exists = favs.includes(email);

    const nextFavs = exists
      ? favs.filter((e: string) => e !== email) // explicit type for TS
      : [...favs, email];

    list[idx] = { ...cur, favorites: nextFavs };
    this.writeAll(list);
    return !exists; // true if now favorited, false if removed
  }

  /** Explicit remove favorite */
  remove(flatId?: string | null): boolean {
    const email = this.email();
    if (!flatId || !email) return false;

    const list = this.readAll();
    const idx = list.findIndex(f => f.id === flatId);
    if (idx === -1) return false;

    const cur = list[idx];
    const favs = Array.isArray(cur.favorites) ? cur.favorites : [];
    const nextFavs = favs.filter((e: string) => e !== email);

    list[idx] = { ...cur, favorites: nextFavs };
    this.writeAll(list);
    return true;
  }
}
