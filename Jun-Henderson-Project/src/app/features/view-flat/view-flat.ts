import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ViewFlatService } from './view-flat.service';
import { Flat } from './view-flat.model';
import { FlatMessagesComponent } from "../flat-messages/flat-messages";

@Component({
  standalone: true,
  selector: 'app-view-flat',
  imports: [CommonModule, RouterLink, FlatMessagesComponent],
  templateUrl: './view-flat.html',
  styleUrls: ['./view-flat.css'],
})
export class ViewFlatComponent {
  private route = inject(ActivatedRoute);

  // Explicitly type the injected service so TS doesn't treat it as unknown.
  private store: ViewFlatService = inject(ViewFlatService); // ✔ typed

  // Read id from "/flats/:id"
  readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  // Load once from localStorage
  readonly flat = signal<Flat | null>(this.store.get(this.id)); // ✔ known type now

  // Simple derived labels for UI
  readonly title = computed(() => {
    const f = this.flat();
    if (!f) return 'Flat Details';
    const left = [f.city, f.streetName].filter(Boolean).join(' — ');
    const right = f.streetNumber ? String(f.streetNumber) : '';
    return [left, right].filter(Boolean).join(' ');
  });

  readonly acLabel = computed(() => {
    const f = this.flat();
    if (!f) return '';
    return f.hasAC ? 'Has AC' : 'No AC';
  });

  readonly priceLabel = computed(() => {
    const f = this.flat();
    if (!f) return '';
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'CAD' })
        .format(f.rentPrice || 0);
    } catch {
      return `CAD ${f.rentPrice ?? 0}`;
    }
  });
}
