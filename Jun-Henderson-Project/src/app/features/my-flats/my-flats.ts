import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MyFlatsService } from './my-flats.service';
import { Flat } from './my-flats.model';

@Component({
  standalone: true,
  selector: 'app-my-flats',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-flats.html',
  styleUrls: ['./my-flats.css'],
})
export class MyFlatsComponent {
  private store = inject(MyFlatsService);
  private router = inject(Router);

  readonly uid = this.store.userId();               // user must be logged (guard)
  readonly flats = signal<Flat[]>(this.store.listMine());

  readonly title = computed(() => 'My Flats');
  readonly countLabel = computed(() => {
    const n = this.flats().length;
    return n === 1 ? '1 flat' : `${n} flats`;
  });

  priceLabel(rent: number): string {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'CAD' }).format(rent || 0);
    } catch {
      return `CAD ${rent ?? 0}`;
    }
  }

  refresh(): void {
    this.flats.set(this.store.listMine());
  }

  onDelete(id: string): void {
    const ok = confirm('Delete this flat? This action cannot be undone.');
    if (!ok) return;

    const removed = this.store.removeIfOwner(id);
    if (!removed) {
      alert('You can only delete your own flats.');
      return;
    }
    this.refresh();
  }

  goView(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/flat', id]);
  }

  goEdit(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/flat', id, 'edit']);
  }
}
