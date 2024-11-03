import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  ngOnInit(): void {
    this.send()
  }

  send(){
    this.authService.sendEmail();
  }

  continue() {
    this.authService.reload()
    ?.then(() => {
      this.router.navigateByUrl('/home');
    })
    .catch(() => {
      
    });
  }
}
