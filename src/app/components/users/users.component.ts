import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormRegisterPacienteComponent } from '../form-register-paciente/form-register-paciente.component';
import { FormRegisterEspecialistaComponent } from '../form-register-especialista/form-register-especialista.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { FormRegisterAdminComponent } from '../form-register-admin/form-register-admin.component';
import { TableModule } from 'primeng/table';
import { IAdmin, IEspecialista, IPaciente, IUser } from '../../interfaces/user.interface';
import { FirestoreService } from '../../services/firestore.service';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TabMenuModule,
    FormRegisterPacienteComponent,
    FormRegisterEspecialistaComponent,
    FormRegisterAdminComponent,
    TableModule,
    ButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  userService = inject(UserService);

  errorMessage = "";

  itemsAction: MenuItem[] | undefined;
  itemsRole: MenuItem[] | undefined;

  action!: MenuItem;
  role!: MenuItem;

  users: IUser[] = [];

  userKeys : string[] = []

  loaderState = {
    loading: false,
    state: "check"
  }
  
  ngOnInit() {
      this.itemsAction = [
          { label: 'Crear', icon: 'pi pi-user-plus' },
          { label: 'Listar', icon: 'pi pi-home' },
      ];

      this.itemsRole = [
        { label: 'paciente', icon: 'pi pi-user',  },
        { label: 'especialista', icon: 'pi pi-heart' },
        { label: 'admin', icon: 'pi pi-key' },
    ];


    this.action = this.itemsAction[0];
    this.role = this.itemsRole[0];
    this.getUsers();
  }

  onActionChange(event: MenuItem) {
      this.action = event;
  }

  onRoleChange(event: MenuItem) {
    this.role = event;
    this.getUsers();
  }

  onRegister(data: any) {
    this.loaderState.loading = true;
    data.data.role = this.role?.label;
    if (this.role?.label != "especialista")
      data.data.estaHabilitado = false;
    console.log(data);
    this.storageService.uploadMultiple(data.files)
      .subscribe({
        next: (urlsObject) => {
          const keys = Object.keys(urlsObject);
          for (let key of keys) {
            data.data[key] = urlsObject[key];
          }
          this.authService.singUp(data.data)
            .subscribe({
              next: (_) => {
                this.loaderState.state = "check";
                setTimeout(() => {
                  this.loaderState.state = "loading";
                  this.loaderState.loading = false;
                },
                1500);
              },
              error: (err) => {
                switch (err.code) {
                  case "auth/email-already-in-use":
                    this.errorMessage = 'El correo ya está en uso';
                    break;
                  case "auth/invalid-email":
                    this.errorMessage = 'Correo electronico invalido';
                    break;
                  case "auth/operation-not-allowed":
                    this.errorMessage = "Operación no permitida"
                    break;
                  case "auth/weak-password":
                    this.errorMessage = "Constraseña debil"
                }

                this.loaderState.state = "error";
                setTimeout(() => {
                  this.loaderState.state = "loading";
                  this.loaderState.loading = false;
                },
                  1500);
              },
            });

        },
        error: (err) => {
          this.errorMessage = "Error al subir la imagen";
          this.loaderState.state = "error";
          setTimeout(() => {
            this.loaderState.state = "loading";
            this.loaderState.loading = false;
          },
          1500);
        }
      });
    }

    async getUsers() {
      this.userService.getUsersByRole(this.role.label!)
      .then( (users) => {
          this.users = users;
          if(users.length > 0) {
            this.userKeys = Object.keys(users[0]);
          }
        }
      );
  }
  
  async deshabilitar(user: IEspecialista) {
    const response = await this.userService.updateEstaHabilitado(user, false)
    if(response) 
      user.estaHabilitado = false;
  }

  async habilitar(user: IEspecialista) {
    const response = await this.userService.updateEstaHabilitado(user, true)
    if(response) 
      user.estaHabilitado = true;
  }
}
