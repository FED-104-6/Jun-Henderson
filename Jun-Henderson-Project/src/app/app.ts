import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

function shouldShowNavbar(path: string): boolean {
  const clean = (path || '/').split('?')[0];
  // ⬇️ esconde em "/", "/login" e "/register"
  return !/^\/($|login$|register$)/.test(clean);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <nav class="hf-nav" *ngIf="showNavbar">
      <div class="hf-nav-inner">
        <a routerLink="/home" class="hf-brand"><span class="hf-brand-text">FlatFinder</span></a>
        <ul class="hf-links">
          <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
          <li><a routerLink="/my-flats" routerLinkActive="active">My Flats</a></li>
          <li><a routerLink="/favorites" routerLinkActive="active">Favourites</a></li>
          <li><a routerLink="/new-flat" routerLinkActive="active">New Flat</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
          <li><a routerLink="/admin/users" routerLinkActive="active">All Users</a></li>
        </ul>
      </div>
    </nav>
    <main class="page">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  showNavbar = shouldShowNavbar(location.pathname);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects ?? e.url ?? location.pathname;
        this.showNavbar = shouldShowNavbar(url);
      });
  }
}
