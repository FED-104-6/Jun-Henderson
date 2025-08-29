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

  // Greeting shown on the navbar (displayName -> email -> "User")
  readonly userName = signal<string>('User');

  // When you wire an admin flag later, flip this to a real value
  readonly isAdmin = signal<boolean>(false);

  constructor() {
    const u = this.auth.currentUser;
    const name = u?.displayName || u?.email || 'User';
    this.userName.set(name);
  }
}
