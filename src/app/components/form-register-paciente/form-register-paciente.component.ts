import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileSendEvent, FileUploadModule } from 'primeng/fileupload';
import { confirmPasswordValidator } from '../../validators/password.validator';
import { emailTakenAsyncValidator, dniTakenAsyncValidator } from '../../validators/user.validator';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-register-paciente',
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
    CommonModule,
  ],
  templateUrl: './form-register-paciente.component.html',
  styleUrl: './form-register-paciente.component.css'
})
export class FormRegisterPacienteComponent implements OnInit {
  @Output() onRegister = new EventEmitter<any>();
  form!: FormGroup;
  userService = inject(UserService);

  selectedProfilePicture : File | null = null; 
  selectedProfilePictureAux : File | null = null; 

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl("", {
          asyncValidators: emailTakenAsyncValidator(this.userService),
          updateOn: 'blur',
          validators: [Validators.required, Validators.email]
        }),
        nombre: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
        apellido: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
        dni: new FormControl("", {
          asyncValidators: dniTakenAsyncValidator(this.userService),
          updateOn: 'blur',
          validators: [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8), Validators.maxLength(8)]
        }),
        password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
        rePassword: new FormControl("", [Validators.required]),
        obraSocial: new FormControl("", [Validators.required, Validators.min(1)]),
        edad: new FormControl("1", [Validators.required, Validators.min(1)]),
        imagenPerfil: new FormControl("", [Validators.required]),
        imagenPerfilAux: new FormControl("", [Validators.required]),
      },
      confirmPasswordValidator()
    );
  }



  get email(){
    return this.form.get('email');
  }
  get nombre(){
    return this.form.get('nombre');
  }
  get apellido(){
    return this.form.get('apellido');
  }
  get dni(){
    return this.form.get('dni');
  }
  get password(){
    return this.form.get('password');
  }
  get rePassword(){
    return this.form.get('rePassword');
  }
  get obraSocial(){
    return this.form.get('obraSocial');
  }
  get edad(){
    return this.form.get('edad');
  }

  get imagenPerfil(){
    return this.form.get('imagenPerfil');
  }

  get imagenPerfilAux(){
    return this.form.get('imagenPerfilAux');
  }

  sendForm() {
    if(this.form.valid) {
      const dataAux = {data: {...this.form.value}, files: {
        imagenPerfil: this.selectedProfilePicture!,
        imagenPerfilAux: this.selectedProfilePictureAux!, 
      }};
      delete dataAux.data.rePassword;

      this.onRegister.emit(dataAux);
    }
  }


  clickFileInput(id : string) {
    const fileInput = document.getElementById(id);
    fileInput?.click();
  }

  selectProfilePicture(event : any) {
    console.log();
    const file = event.target.files[0];
    const preview = document.getElementById(`preview-${event.srcElement.id}`) as any;
    console.log(file);
    this.selectedProfilePicture = file;
    if(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview!.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    }
    else {
      preview.src="/assets/user/defaultUser.png"
    }
  }

  selectProfilePictureAux(event : any) {
    console.log();
    const file = event.target.files[0];
    const preview = document.getElementById(`preview-${event.srcElement.id}`) as any;
    console.log(file);
    this.selectedProfilePictureAux = file;
    if(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview!.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    }
    else {
      preview.src="/assets/user/defaultUser.png"
    }
  }
}
