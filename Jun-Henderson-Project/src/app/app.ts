import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private auth = inject(Auth);

  // Greeting and admin flag (wire real isAdmin from Dev B later)
  readonly userName = signal<string>('User');
  readonly isAdmin  = signal<boolean>(false);

  constructor() {
    const u = this.auth.currentUser;
    const name = u?.displayName || u?.email || 'User';
    this.userName.set(name);

    this.isAdmin.set(false);
  }
}
