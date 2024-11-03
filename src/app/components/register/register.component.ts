import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { FormRegisterPacienteComponent } from '../form-register-paciente/form-register-paciente.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormRegisterEspecialistaComponent } from '../form-register-especialista/form-register-especialista.component';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { StorageService } from '../../services/storage.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    DividerModule,
    ButtonModule,
    RadioButtonModule,
    FormRegisterPacienteComponent,
    FormRegisterEspecialistaComponent,
    FloatLabelModule,
    PasswordModule,
    LoaderComponent,
    RecaptchaModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  router = inject(Router);
  authService = inject(AuthService);
  storageService = inject(StorageService);

  role = 'paciente';
  loaderState = {
    loading: false,
    state: 'loading',
  };
  errorMessage = '';
  token: string | null = null;

  onLoginClick() {
    this.router.navigateByUrl('login');
  }

  onRegister(data: any) {
    this.loaderState.loading = true;
    data.data.role = this.role;
    if (this.role != 'especialista') data.data.estaHabilitado = false;
    console.log(data);
    this.storageService.uploadMultiple(data.files).subscribe({
      next: (urlsObject) => {
        const keys = Object.keys(urlsObject);
        for (let key of keys) {
          data.data[key] = urlsObject[key];
        }
        this.authService.singUp(data.data).subscribe({
          next: (_) => {
            this.loaderState.state = 'check';
            this.router.navigateByUrl('/welcome');
          },
          error: (err) => {
            switch (err.code) {
              case 'auth/email-already-in-use':
                this.errorMessage = 'El correo ya está en uso';
                break;
              case 'auth/invalid-email':
                this.errorMessage = 'Correo electronico invalido';
                break;
              case 'auth/operation-not-allowed':
                this.errorMessage = 'Operación no permitida';
                break;
              case 'auth/weak-password':
                this.errorMessage = 'Constraseña debil';
            }

            this.loaderState.state = 'error';
            setTimeout(() => {
              this.loaderState.state = 'loading';
              this.loaderState.loading = false;
            }, 1500);
          },
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al subir la imagen';
        this.loaderState.state = 'error';
        setTimeout(() => {
          this.loaderState.state = 'loading';
          this.loaderState.loading = false;
        }, 1500);
      },
    });
  }

  executeReCaptcha(token: string | null) {
    this.token = token;
    if (token) {
      this.loaderState.loading = false; // Deja de mostrar el loader si CAPTCHA es válido
    }
  }
}
