import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormRegisterPacienteComponent } from '../form-register-paciente/form-register-paciente.component';
import { FormRegisterEspecialistaComponent } from '../form-register-especialista/form-register-especialista.component';
import { FormRegisterAdminComponent } from '../form-register-admin/form-register-admin.component';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { StorageService } from '../../services/storage.service';
import { scaleUpAnimation } from '../../animations/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormRegisterPacienteComponent,
    FormRegisterEspecialistaComponent,
    FormRegisterAdminComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [scaleUpAnimation],
})
export class RegisterComponent {
  router = inject(Router);
  authService = inject(AuthService);
  storageService = inject(StorageService);

  role = '';
  loaderState = {
    loading: false,
    state: 'loading',
  };
  errorMessage = '';

  onLoginClick() {
    this.router.navigateByUrl('login');
  }

  onRegister(data: any) {
    this.loaderState.loading = true;
    data.data.role = this.role;
    if (this.role == 'especialista') data.data.estaHabilitado = false;
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
                this.errorMessage = 'Correo electrónico inválido';
                break;
              case 'auth/operation-not-allowed':
                this.errorMessage = 'Operación no permitida';
                break;
              case 'auth/weak-password':
                this.errorMessage = 'Contraseña débil';
                break;
              default:
                this.errorMessage = 'Error en el registro';
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

  selectRole(role: string) {
    this.role = role;
  }
}
