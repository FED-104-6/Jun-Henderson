import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from '@angular/fire/auth';

function match(otherControlName: string) {
  return (control: AbstractControl) => {
    if (!control.parent) return null;
    const other = control.parent.get(otherControlName);
    return other && control.value === other.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  loading = signal(false);
  fireError = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, match('password')]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  get f() { return this.form.controls; }

  readonly errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already in use.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Weak password (minimum 6 characters).',
    'auth/operation-not-allowed': 'Registration is disabled in this project.',
    'auth/invalid-api-key': 'Invalid Firebase API key.',
    'auth/network-request-failed': 'Network request failed. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };

  async submit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.fireError.set(null);
    this.success.set(null);

    const { displayName, email, password } = this.form.getRawValue();

    try {
      if (!email || !password) return;
      const cred = await createUserWithEmailAndPassword(this.auth, email.trim(), password);
      if (displayName) await updateProfile(cred.user, { displayName: String(displayName).trim() });
      try { await sendEmailVerification(cred.user); } catch {}
      this.success.set('Account created! Please check your email to verify.');
      this.form.reset({ acceptTerms: false });
    } catch (e: any) {
      const code = e?.code ?? 'unknown';
      const message = e?.message ?? '';
      const mapped = this.errorMap[code];
      this.fireError.set(mapped ? mapped : `${code} ${message}`.trim());
      console.error('Firebase register error:', e);
    } finally {
      this.loading.set(false);
    }
  }
}
