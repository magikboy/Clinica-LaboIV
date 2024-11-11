import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../services/user.service';
import {
  dniTakenAsyncValidator,
  emailTakenAsyncValidator,
} from '../../validators/user.validator';
import { confirmPasswordValidator } from '../../validators/password.validator';
import { MultiSelectModule } from 'primeng/multiselect';
import { RecaptchaModule } from 'ng-recaptcha';


@Component({
  selector: 'app-form-register-especialista',
  standalone: true,
  imports: [
    FormsModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    InputNumberModule,
    ReactiveFormsModule,
    MultiSelectModule,
    RecaptchaModule,
  ],
  templateUrl: './form-register-especialista.component.html',
  styleUrl: './form-register-especialista.component.css',
})
export class FormRegisterEspecialistaComponent {
  @Output() onRegister = new EventEmitter<any>();
  form!: FormGroup;
  userService = inject(UserService);
  nuevaEspecialidad = '';

  captchaResolved: boolean = false;

  especialidadesChoice = [
    'psicologia',
    'fisioterapia',
    'urologia',
    'traumatologia',
    'pediatria',
    'cardiologia',
  ];

  selectedProfilePicture: File | null = null;

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl('', {
          asyncValidators: emailTakenAsyncValidator(this.userService),
          updateOn: 'blur',
          validators: [Validators.required, Validators.email],
        }),
        nombre: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        dni: new FormControl('', {
          asyncValidators: dniTakenAsyncValidator(this.userService),
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]+$'),
            Validators.minLength(8),
            Validators.maxLength(8),
          ],
        }),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
        ]),
        rePassword: new FormControl('', [Validators.required]),
        edad: new FormControl('1', [Validators.required, Validators.min(18)]),
        imagenPerfil: new FormControl('', [Validators.required]),
        especialidades: new FormControl('', [Validators.required]),
      },
      confirmPasswordValidator()
    );
  }

  get email() {
    return this.form.get('email');
  }
  get nombre() {
    return this.form.get('nombre');
  }
  get apellido() {
    return this.form.get('apellido');
  }
  get dni() {
    return this.form.get('dni');
  }
  get password() {
    return this.form.get('password');
  }
  get rePassword() {
    return this.form.get('rePassword');
  }
  get obraSocial() {
    return this.form.get('obraSocial');
  }
  get edad() {
    return this.form.get('edad');
  }

  get imagenPerfil() {
    return this.form.get('imagenPerfil');
  }

  get especialidades() {
    return this.form.get('especialidades');
  }
  sendForm() {
    if (this.form.valid && this.captchaResolved) {
      const dataAux = {
        data: { ...this.form.value },
        files: {
          imagenPerfil: this.selectedProfilePicture!,
        },
      };
      delete dataAux.data.rePassword;

      this.onRegister.emit(dataAux);
    }
  }

  clickFileInput(id: string) {
    const fileInput = document.getElementById(id);
    fileInput?.click();
  }

  selectProfilePicture(event: any) {
    const file = event.target.files[0];
    const preview = document.getElementById(
      `preview-${event.srcElement.id}`
    ) as any;
    console.log(file);
    this.selectedProfilePicture = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview!.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '/assets/user/defaultUser.png';
    }
  }

  isNotValidEspecialidad() {
    if (
      this.nuevaEspecialidad.length <= 0 ||
      this.especialidadesChoice.includes(this.nuevaEspecialidad)
    ) {
      return true;
    }

    return false;
  }

  addEspecialidad() {
    this.especialidadesChoice.push(this.nuevaEspecialidad);
    this.nuevaEspecialidad = '';
  }

  // Método para manejar el captcha
  executeReCaptcha(token: string | null) {
    this.captchaResolved = token !== null && token !== '';
  }
}
