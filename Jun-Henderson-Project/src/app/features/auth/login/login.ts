import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
success(): any {
throw new Error('Method not implemented.');
}
fireError(): any {
throw new Error('Method not implemented.');
}
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() { return this.form.controls; }

  async submit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.info.set(null);
    try {
      const { email, password } = this.form.getRawValue();
      await signInWithEmailAndPassword(this.auth, email!, password!);
      await this.router.navigateByUrl('/home');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to sign in.');
    } finally {
      this.loading.set(false);
    }
  }

  async resetPassword() {
    const email = this.f.email.value;
    if (!email) { this.error.set('Enter your email to reset the password.'); return; }
    this.loading.set(true);
    this.error.set(null);
    this.info.set(null);
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.info.set('Password reset email sent.');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Could not send reset email.');
    } finally {
      this.loading.set(false);
    }
  }
}
