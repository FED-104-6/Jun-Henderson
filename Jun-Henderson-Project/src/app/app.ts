import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private auth = inject(Auth);
  private router = inject(Router);
  private authPaths = new Set<string>(['/', '/register', '/login']);

  readonly userName = signal<string>('User');
  readonly isAdmin = signal<boolean>(false);
  readonly hideNavbar = signal<boolean>(false);

  constructor() {
    const u = this.auth.currentUser;
    const name = u?.displayName || u?.email || 'User';
    this.userName.set(name);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = (e.urlAfterRedirects ?? e.url ?? '/').split('?')[0];
      this.hideNavbar.set(this.authPaths.has(url));
    });
  }
}
