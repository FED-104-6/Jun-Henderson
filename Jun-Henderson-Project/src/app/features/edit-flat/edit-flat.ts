import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { EditFlatService } from './edit-flat.service';
import { Flat } from './edit-flat.model';

@Component({
  standalone: true,
  selector: 'app-edit-flat',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-flat.html',
  styleUrls: ['./edit-flat.css'],
})
export class EditFlatComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);

  readonly store: EditFlatService = inject(EditFlatService);
  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly currentYear = new Date().getFullYear();
  readonly today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // NOTE: Mirror New Flat validations (all required, correct types).
  form = this.fb.group({
    city: ['', [Validators.required, Validators.minLength(2)]],
    streetName: ['', [Validators.required, Validators.minLength(2)]],
    streetNumber: [1, [Validators.required, Validators.min(1)]],
    areaSize: [1, [Validators.required, Validators.min(1)]],
    hasAC: [false, [Validators.required]],
    yearBuilt: [this.currentYear, [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]],
    rentPrice: [1, [Validators.required, Validators.min(1)]],
    dateAvailable: [this.today, [Validators.required]],
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    // Load the existing flat and prefill the form.
    // If not found, the template will show a "not found" state.
    const existing = this.store.get(this.id);
    if (existing) {
      // Safe prefill 
      this.form.setValue({
        city: existing.city ?? '',
        streetName: existing.streetName ?? '',
        streetNumber: Number(existing.streetNumber ?? 1),
        areaSize: Number(existing.areaSize ?? 1),
        hasAC: Boolean(existing.hasAC ?? false),
        yearBuilt: Number(existing.yearBuilt ?? this.currentYear),
        rentPrice: Number(existing.rentPrice ?? 1),
        dateAvailable: String(existing.dateAvailable ?? this.today),
      });
    }
  }

  submit(): void {
    // Guard invalid forms
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show validation errors
      return;
    }

    // Prepare patch with the exact form shape.
    const patch: Partial<Flat> = {
      city: this.f.city.value!,
      streetName: this.f.streetName.value!,
      streetNumber: Number(this.f.streetNumber.value),
      areaSize: Number(this.f.areaSize.value),
      hasAC: !!this.f.hasAC.value,
      yearBuilt: Number(this.f.yearBuilt.value),
      rentPrice: Number(this.f.rentPrice.value),
      dateAvailable: this.f.dateAvailable.value!,
    };

    const updated = this.store.update(this.id, patch);
    if (!updated) {
      console.error('[EditFlatComponent] Update failed or flat not found.');
      return;
    }

    // Per instructions: redirect to Home after save.
    // Home will be created later; point to '/home'.
    this.router.navigateByUrl('/home');
  }
}
