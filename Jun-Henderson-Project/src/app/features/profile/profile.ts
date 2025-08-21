import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, updateProfile, sendEmailVerification, signOut, User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  fireError = signal<string | null>(null);
  success = signal<string | null>(null);
  user = signal<User | null>(null);

  form = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    photoURL: ['', []],
  });

  email = computed(() => this.user()?.email ?? '');
  emailVerified = computed(() => this.user()?.emailVerified ?? false);
  photo = computed(() => this.user()?.photoURL ?? '');

  constructor() {
    onAuthStateChanged(this.auth, u => {
      this.user.set(u);
      if (u) {
        this.form.patchValue({
          displayName: u.displayName ?? '',
          photoURL: u.photoURL ?? ''
        });
      }
    });
  }

  get f() { return this.form.controls; }

  async save() {
    if (this.form.invalid || this.loading() || !this.user()) return;
    this.loading.set(true);
    this.fireError.set(null);
    this.success.set(null);
    try {
      await updateProfile(this.user()!, {
        displayName: String(this.form.value.displayName ?? '').trim(),
        photoURL: String(this.form.value.photoURL ?? '').trim() || null as any
      });
      this.success.set('Profile updated.');
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const msg = e?.message ?? '';
      this.fireError.set(`${code} ${msg}`.trim());
    } finally {
      this.loading.set(false);
    }
  }

  async sendVerify() {
    if (!this.user() || this.emailVerified()) return;
    this.fireError.set(null);
    this.success.set(null);
    try {
      await sendEmailVerification(this.user()!);
      this.success.set('Verification email sent.');
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const msg = e?.message ?? '';
      this.fireError.set(`${code} ${msg}`.trim());
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigateByUrl('/login');
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const msg = e?.message ?? '';
      this.fireError.set(`${code} ${msg}`.trim());
    }
  }
}
