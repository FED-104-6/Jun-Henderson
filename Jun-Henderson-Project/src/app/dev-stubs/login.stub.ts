import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:24px;color:#fff">
      <h2>Login (stub)</h2>
      <p>Router OK. Firebase ainda não conectado.</p>
      <a routerLink="/" style="color:#9cf">Voltar ao Register</a>
    </div>
  `,
})
export class LoginStub {}
