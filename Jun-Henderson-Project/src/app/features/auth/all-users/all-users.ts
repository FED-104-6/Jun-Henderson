import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AppUser, UserType } from '../../../models/user.entity';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

type SortKey = 'firstName' | 'lastName' | 'flatsCount';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './all-users.html',
  styleUrls: ['./all-users.css'],
})
export class AllUsersComponent {
  private userSvc = inject(UserService);
  private fb = inject(FormBuilder);

  users = signal<AppUser[]>([]);
  filtered = signal<AppUser[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  filters = this.fb.group({
    userType: [''],
    ageMin: [''],
    ageMax: [''],
    flatsMin: [''],
    flatsMax: [''],
    isAdmin: [''],
    sortBy: ['firstName' as SortKey],
    sortDir: ['asc' as 'asc' | 'desc'],
    search: [''],
  });

  async ngOnInit() {
    try {
      const data = await this.userSvc.listAll();
      this.users.set(data);
      this.apply();
    } catch (e: any) {
      this.error.set(String(e?.message ?? 'Failed to load users'));
    } finally {
      this.loading.set(false);
    }
    this.filters.valueChanges.subscribe(() => this.apply());
  }

  private calcAge(dob: string): number {
    if (!dob) return 0;
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
    }

  apply() {
    const v = this.filters.getRawValue();
    let arr = [...this.users()];

    if (v.search) {
      const q = String(v.search).toLowerCase();
      arr = arr.filter(u =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q)
      );
    }

    if (v.userType) arr = arr.filter(u => u.userType === v.userType);
    const ageMin = Number(v.ageMin || 0);
    const ageMax = Number(v.ageMax || 0);
    if (ageMin) arr = arr.filter(u => this.calcAge(u.dob) >= ageMin);
    if (ageMax) arr = arr.filter(u => this.calcAge(u.dob) <= ageMax);

    const flatsMin = Number(v.flatsMin || 0);
    const flatsMax = Number(v.flatsMax || 0);
    if (flatsMin) arr = arr.filter(u => (u.flatsCount ?? 0) >= flatsMin);
    if (flatsMax) arr = arr.filter(u => (u.flatsCount ?? 0) <= flatsMax);

    if (v.isAdmin === 'true') arr = arr.filter(u => u.isAdmin === true);
    if (v.isAdmin === 'false') arr = arr.filter(u => u.isAdmin === false);

    const key = (v.sortBy || 'firstName') as SortKey;
    const dir = (v.sortDir || 'asc') as 'asc' | 'desc';
    arr.sort((a, b) => {
      const av = (a as any)[key] ?? '';
      const bv = (b as any)[key] ?? '';
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    this.filtered.set(arr);
  }

  async setAdmin(u: AppUser, val: boolean) {
    try {
      await this.userSvc.setAdmin(u.id, val);
      u.isAdmin = val;
      this.apply();
    } catch (e: any) {
      this.error.set(String(e?.message ?? 'Failed to update admin'));
    }
  }

  async remove(u: AppUser) {
    try {
      await this.userSvc.removeUser(u.id);
      this.users.set(this.users().filter(x => x.id !== u.id));
      this.apply();
    } catch (e: any) {
      this.error.set(String(e?.message ?? 'Failed to remove user'));
    }
  }
}
