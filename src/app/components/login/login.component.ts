import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from "primeng/floatlabel"
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    CommonModule,
    LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage = ""
  authService = inject(AuthService);
  router = inject(Router);
  userData = {
    email: "",
    password: "",
  }
  loaderState = {
    loading: false,
    state: "loading"
  }

  onLogin() {
    this.loaderState.loading = true;
    this.authService.singIn(this.userData.email, this.userData.password).subscribe(
      {
        next: () => {
          this.loaderState.state = "check"
          this.router.navigateByUrl('/welcome');
        },
        error: (err) => {
          switch(err.code)
          {
            case "auth/invalid-email":
              this.errorMessage = 'El formato de correo es invalido';
              break;
            case "auth/operation-not-allowed":
              this.errorMessage = "Operación no permitida"
              break;
            default:
              this.errorMessage = 'El email o contraseña no son correctos'
          }
          this.loaderState.state = "error";
          setTimeout(() => {
            this.loaderState.state = "loading";
            this.loaderState.loading = false;
          },
            1500);
        }

      }
    );    
  }

  onRegisterClick() {
    this.router.navigateByUrl('register');
  }
}
