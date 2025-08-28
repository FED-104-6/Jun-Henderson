import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';

import { ViewFlatService } from '../view-flat/view-flat.service';
import type { Flat } from '../view-flat/view-flat.model';
import { FavoritesService } from '../favourites/favorites.service';

type SortBy = 'city' | 'rentPrice' | 'areaSize';
const STORAGE_KEY = 'flats';

type HeroFlat = Flat & { subtitle: string }; // extra text for featured cards

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  private fb = inject(NonNullableFormBuilder);
  private store = inject(ViewFlatService);
  private router = inject(Router);
  private favs = inject(FavoritesService, { optional: true });
  private auth = inject(Auth);

  // Keep auth user as a signal so UI updates on login changes
  readonly user = signal<User | null>(this.auth.currentUser);

  constructor() {
    this.auth.onAuthStateChanged(u => this.user.set(u));
    this.purgeOldSeeds(); // remove old legacy data
  }

  // Welcome banner name (displayName > email > "User")
  readonly displayName = computed<string>(() => {
    const u = this.user();
    return (u?.displayName || u?.email || 'User') as string;
  });

  // Stored flats (localStorage)
  readonly flats = signal<Flat[]>(this.store.list());

  // Fixed featured cards
  readonly featured = signal<HeroFlat[]>([
    {
      id: 'hero-1',
      city: 'Vancouver',
      streetName: 'Robson St',
      streetNumber: 101,
      areaSize: 48,
      hasAC: true,
      yearBuilt: 2018,
      rentPrice: 2200,
      dateAvailable: '2025-09-01',
      image: 'assets/flats/hero-1.jpg',
      subtitle: 'Cozy downtown condo near shops',
    },
    {
      id: 'hero-2',
      city: 'Burnaby',
      streetName: 'Kingsway',
      streetNumber: 2500,
      areaSize: 60,
      hasAC: false,
      yearBuilt: 2016,
      rentPrice: 1950,
      dateAvailable: '2025-08-15',
      image: 'assets/flats/hero-2.jpg',
      subtitle: 'Bright unit close to Metrotown',
    },
    {
      id: 'hero-3',
      city: 'Richmond',
      streetName: 'No.3 Rd',
      streetNumber: 850,
      areaSize: 55,
      hasAC: true,
      yearBuilt: 2020,
      rentPrice: 2100,
      dateAvailable: '2025-09-10',
      image: 'assets/flats/hero-3.jpg',
      subtitle: 'Modern apartment near SkyTrain',
    },
  ]);

  // Filters form
  readonly form = this.fb.group({
    city: [''],
    priceMin: [0],
    priceMax: [0],
    areaMin: [0],
    areaMax: [0],
    sortBy: ['city' as SortBy],
  });

  // Applied filters snapshot
  readonly filters = signal(this.form.getRawValue());
  applyFilters(): void {
    this.filters.set(this.form.getRawValue());
  }

  // City dropdown options (from stored flats)
  readonly cityOptions = computed(() => {
    const set = new Set(this.flats().map(f => (f.city || '').trim()).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  // Filter + sort for stored flats
  readonly rows = computed<Flat[]>(() => {
    const { city, priceMin, priceMax, areaMin, areaMax, sortBy } = this.filters();
    let data = [...this.flats()];

    if (city && city.trim()) {
      const q = city.trim().toLowerCase();
      data = data.filter(f => f.city?.toLowerCase().includes(q));
    }

    const pMin = Number(priceMin) || 0;
    const pMax = Number(priceMax) || 0;
    if (pMin) data = data.filter(f => (f.rentPrice ?? 0) >= pMin);
    if (pMax) data = data.filter(f => (f.rentPrice ?? 0) <= pMax);

    const aMin = Number(areaMin) || 0;
    const aMax = Number(areaMax) || 0;
    if (aMin) data = data.filter(f => (f.areaSize ?? 0) >= aMin);
    if (aMax) data = data.filter(f => (f.areaSize ?? 0) <= aMax);

    data.sort((x, y) => {
      const ax = (x as any)[sortBy] ?? '';
      const ay = (y as any)[sortBy] ?? '';
      if (typeof ax === 'string' && typeof ay === 'string') return ax.localeCompare(ay);
      return (ax as number) - (ay as number);
    });

    return data;
  });

  // Apply the same filters to featured
  readonly filteredFeatured = computed<HeroFlat[]>(() => {
    const { city, priceMin, priceMax, areaMin, areaMax } = this.filters();
    let data = [...this.featured()];

    if (city && city.trim()) {
      const q = city.trim().toLowerCase();
      data = data.filter(f => f.city?.toLowerCase().includes(q));
    }

    const pMin = Number(priceMin) || 0;
    const pMax = Number(priceMax) || 0;
    if (pMin) data = data.filter(f => (f.rentPrice ?? 0) >= pMin);
    if (pMax) data = data.filter(f => (f.rentPrice ?? 0) <= pMax);

    const aMin = Number(areaMin) || 0;
    const aMax = Number(areaMax) || 0;
    if (aMin) data = data.filter(f => (f.areaSize ?? 0) >= aMin);
    if (aMax) data = data.filter(f => (f.areaSize ?? 0) <= aMax);

    return data;
  });

  /* storage helpers  */
  private readAll(): Flat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private writeAll(list: Flat[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this.flats.set(list);
  }

  private ensureInStore(flat: Flat): void {
    const list = this.readAll();
    if (!list.some(f => f.id === flat.id)) {
      list.push({ ...flat });
      this.writeAll(list);
    }
  }

  private purgeOldSeeds(): void {
    const list = this.readAll();
    const cleaned = list.filter(f => !(f.id === 'seed-1' || f.id === 'seed-2' || f.id === 'seed-3'));
    if (cleaned.length !== list.length) {
      this.writeAll(cleaned);
    }
  }

  /* navigation */
  viewFlat(id?: string | null): void {
    if (!id) return;
    const hero = this.featured().find(f => f.id === id);
    if (hero) this.ensureInStore(hero);
    this.router.navigate(['/flat', id]);
  }

  /* favourites */
  isFav(id?: string | null): boolean {
    return !!this.favs?.isFavorite(id ?? null);
  }

  toggleFav(id?: string | null): void {
    if (!id) return;
    const hero = this.featured().find(f => f.id === id);
    if (hero) this.ensureInStore(hero);
    this.favs?.toggle(id);
    this.router.navigate(['/favorites']);
  }

  /*  images (LOCAL fallbacks)  */
  imageOf(f: Flat): string {
    // Use a local fallback to avoid external DNS issues
    return f.image || 'assets/flats/hero-1.jpg';
  }

  heroImageOf(f: HeroFlat): string {
    return f.image || 'assets/flats/hero-1.jpg';
  }

  /* trackBy */
  trackById(_: number, f: Flat) {
    return f.id ?? '';
  }
}
