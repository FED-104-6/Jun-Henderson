import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewFlatService } from './new-flat.service';
import { Flat } from './new-flat.model';

@Component({
  selector: 'app-new-flat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-flat.html',
  styleUrls: ['./new-flat.css'],
})
export class NewFlatComponent {
  private fb = inject(NonNullableFormBuilder);
  private service = inject(NewFlatService);
  private router = inject(Router);

  today = new Date().toISOString().slice(0, 10);
  currentYear = new Date().getFullYear();

  readonly imagePreview = signal<string | undefined>(undefined);

  form = this.fb.group({
    city: ['', [Validators.required, Validators.minLength(2)]],
    streetName: ['', [Validators.required, Validators.minLength(2)]],
    streetNumber: [0, [Validators.required, Validators.min(1)]],
    areaSize: [0, [Validators.required, Validators.min(1)]],
    hasAC: [false, [Validators.required]],
    yearBuilt: [new Date().getFullYear(), [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
    rentPrice: [0, [Validators.required, Validators.min(1)]],
    dateAvailable: [this.today, [Validators.required]],
  });

  get f() { return this.form.controls; }

  onImageSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.imagePreview.set(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview.set(String(reader.result)); };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: Flat = {
      city: this.f.city.value!,
      streetName: this.f.streetName.value!,
      streetNumber: Number(this.f.streetNumber.value),
      areaSize: Number(this.f.areaSize.value),
      hasAC: !!this.f.hasAC.value,
      yearBuilt: Number(this.f.yearBuilt.value),
      rentPrice: Number(this.f.rentPrice.value),
      dateAvailable: this.f.dateAvailable.value!,
      image: this.imagePreview(),
    };

    this.service.createFlat(payload).subscribe({
      next: ({ id }) => this.router.navigateByUrl(`/flat/${id}`),
      error: (err) => console.error('[NewFlatComponent] Error creating flat:', err),
    });
  }
}
