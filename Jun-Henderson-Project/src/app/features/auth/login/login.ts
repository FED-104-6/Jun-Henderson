import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  loading = signal(false);
  fireError = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() { return this.form.controls; }

  readonly errorMap: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account is disabled.',
    'auth/user-not-found': 'User not found.',
    'auth/wrong-password': 'Wrong password.',
    'auth/network-request-failed': 'Network request failed. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };

  async submit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.fireError.set(null);
    this.success.set(null);

    const { email, password } = this.form.getRawValue();

    try {
      if (!email || !password) return;
      await signInWithEmailAndPassword(this.auth, email.trim(), password);
      this.success.set('Logged in successfully.');
      this.form.reset();
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const message = e?.message ?? '';
      const mapped = this.errorMap[code];
      this.fireError.set(mapped ? mapped : `${code} ${message}`.trim());
      console.error('Firebase login error:', e);
    } finally {
      this.loading.set(false);
    }
  }

  async resetPassword() {
    if (this.loading()) return;
    this.fireError.set(null);
    this.success.set(null);
    const email = this.form.controls.email.value;
    if (!email) {
      this.fireError.set('Enter your email to reset the password.');
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email.trim());
      this.success.set('Password reset email sent.');
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const message = e?.message ?? '';
      const mapped = this.errorMap[code];
      this.fireError.set(mapped ? mapped : `${code} ${message}`.trim());
      console.error('Firebase reset error:', e);
    }
  }
}
