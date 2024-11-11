import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from "primeng/floatlabel";
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { scaleUpAnimation } from '../../animations/animations';
import { BorderColorByRoleDirective } from '../directives/border-color-by-role.directive';
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
    LoaderComponent,
    BorderColorByRoleDirective,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    scaleUpAnimation
  ]
})
export class LoginComponent {
  errorMessage = "";
  authService = inject(AuthService);
  router = inject(Router);
  userCredentials: IUserCredentials[] = [
    {
      email: 'paciente11@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2Fmedico%202.png?alt=media&token=4c932d29-b456-4bc2-a091-c90c1cd3b14f',
      role: 'paciente',
    },
    {
      email: 'paciente22@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2Fmedico%203.jpg?alt=media&token=1c21154b-ac9b-4509-acef-b397cf2c8f49',
      role: 'paciente',
    },
    {
      email: 'paciente33@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2Fmedica.png?alt=media&token=8785cf7a-4b38-4481-8549-cd498283ad08',
      role: 'paciente',
    },
    {
      email: 'especialista11@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2F15%3A25%3A44%20GMT-0300%20(hora%20est%C3%A1ndar%20de%20Argentina)_medico.png?alt=media&token=191df5f6-945f-4077-aa17-c28230c8b240',
      role: 'especialista',
    },
    {
      email: 'especialista22@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2Fmedico%202.jpeg?alt=media&token=957389d6-c1c3-4863-9f23-0941eaac5f41',
      role: 'especialista',
    },
    {
      email: 'massi11@yopmail.com',
      password: 'massimo2611',
      picture: 'https://firebasestorage.googleapis.com/v0/b/appspps-5d63c.appspot.com/o/files%2Fmedico%201.jpg?alt=media&token=5b0f3d60-0979-43c6-b3cf-69515f6f522a',
      role: 'admin',
    },
  ];

  userData = {
    email: "",
    password: "",
  };

  loaderState = {
    loading: false,
    state: "loading"
  };

  onLogin() {
    this.loaderState.loading = true;
    this.authService.currentUserSignal.set(undefined);
    this.authService.singIn(this.userData.email, this.userData.password).subscribe(
      {
        next: () => {
          this.loaderState.state = "check";
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          switch (err.code) {
            case "auth/invalid-email":
              this.errorMessage = 'El formato de correo es invalido';
              break;
            case "auth/operation-not-allowed":
              this.errorMessage = "Operación no permitida";
              break;
            case "auth/emailNotVerified":
              this.errorMessage = "Email no verificado";
              break;
            case "auth/noHabilitado":
              this.errorMessage = "Especialista no habilitado";
              break;
            default:
              this.errorMessage = 'El email o contraseña no son correctos';
          }
          this.loaderState.state = "error";
          setTimeout(() => {
            this.loaderState.state = "loading";
            this.loaderState.loading = false;
          }, 1500);
        },
      }
    );
  }

  quickLogin(email: string, password: string) {
    this.userData.email = email;
    this.userData.password = password;
    this.onLogin(); // Trigger the login process
  }

  onLoadCredentials(userCredential: IUserCredentials) {
    this.userData.email = userCredential.email;
    this.userData.password = userCredential.password;
  }

  onRegisterClick() {
    this.router.navigateByUrl('register');
  }
}

interface IUserCredentials {
  email: string;
  password: string;
  role: string;
  picture: string;
}
