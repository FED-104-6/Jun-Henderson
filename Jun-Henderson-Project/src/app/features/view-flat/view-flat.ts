import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';

import { ViewFlatService } from './view-flat.service';
import type { Flat } from './view-flat.model';
import { FlatMessagesComponent } from '../flat-messages/flat-messages'; // keep from main

@Component({
  standalone: true,
  selector: 'app-view-flat',
  imports: [CommonModule, RouterLink, FlatMessagesComponent],
  templateUrl: './view-flat.html',
  styleUrls: ['./view-flat.css'],
})
export class ViewFlatComponent {
  // Services
  public store = inject(ViewFlatService);   // public so template can call if needed
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  // Current id from route
  readonly id = computed<string | null>(() => this.route.snapshot.paramMap.get('id'));

  // Return the flat or undefined (not null) to satisfy the template typing
  flat(): Flat | undefined {
    const fid = this.id();
    if (!fid) return undefined;
    // If your service returns Flat | null, coerce null to undefined
    return this.store.get(fid) ?? undefined;
  }

  // Normalize image path so local and remote values render safely
  private normalizeImagePath(img?: string | null): string {
    const fallback = '/assets/flats/hero-1.jpg';
    if (!img) return fallback;
    if (/^https?:\/\//i.test(img)) return img;        // http(s) URL
    if (img.startsWith('/assets/')) return img;       // absolute app asset
    if (img.startsWith('assets/')) return '/' + img;  // relative app asset
    return '/assets/flats/' + img.replace(/^\/+/, ''); // filename
  }

  imageOf(f: Flat | null | undefined): string {
    return this.normalizeImagePath(f?.image ?? null);
  }

  // Owner check
  isOwner(f: Flat | undefined): boolean {
    const uid = this.auth.currentUser?.uid;
    return !!f?.ownerId && !!uid && f.ownerId === uid;
  }

  // Navigation
  goEdit(id?: string | null): void {
    if (!id) return;
    this.router.navigate(['/flat', id, 'edit']);
  }
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
