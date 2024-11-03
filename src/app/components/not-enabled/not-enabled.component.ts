import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-enabled',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './not-enabled.component.html',
  styleUrl: './not-enabled.component.css'
})
export class NotEnabledComponent {

  authService = inject(AuthService);
  router = inject(Router);
  
  retry() {
    this.authService.reload()
    ?.then(() => {
      this.router.navigateByUrl('/home');
    })
    .catch(() => {
      
    });
  }
}
