import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  router = inject(Router);

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  navigateToRegister() {
    this.router.navigateByUrl('/register');
  }
}
