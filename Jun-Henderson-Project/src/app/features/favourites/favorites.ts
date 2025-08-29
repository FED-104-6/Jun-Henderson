import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { FavoritesService } from './favorites.service';
import type { Flat } from '../view-flat/view-flat.model';

@Component({
  standalone: true,
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css'],
})
export class FavoritesComponent {
  private favs = inject(FavoritesService);
  private router = inject(Router);

  // ⬇️ make it public so the template can access data()
  readonly data = signal<Flat[]>(this.favs.listFavorites());
  readonly count = computed(() => this.data().length);

  refresh(): void {
    this.data.set(this.favs.listFavorites());
  }

  imageOf(f: Flat): string {
    return f.image || 'https://via.placeholder.com/480x320?text=Flat';
  }

  viewDetails(id?: string | null): void {
    if (!id) return;
    this.router.navigate(['/flat', id]);
  }

  toggleFav(id?: string | null): void {
    this.favs.toggle(id ?? null);
    this.refresh();
  }

  isFav(id?: string | null): boolean {
    return this.favs.isFavorite(id ?? null);
  }

  trackById(_: number, f: Flat) { return f.id; }
}
