import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormRegisterPacienteComponent } from '../form-register-paciente/form-register-paciente.component';
import { FormRegisterEspecialistaComponent } from '../form-register-especialista/form-register-especialista.component';
import { FormRegisterAdminComponent } from '../form-register-admin/form-register-admin.component';
import { TableModule } from 'primeng/table';
import { ITurno } from '../../interfaces/turno.interface';

import {
  IAdmin,
  IEspecialista,
  IPaciente,
  IUser,
} from '../../interfaces/user.interface';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { VerHistoriaClinicaComponent } from '../ver-historia-clinica/ver-historia-clinica.component';
import { slideInRightAnimation } from '../../animations/animations';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TabMenuModule,
    FormRegisterPacienteComponent,
    FormRegisterEspecialistaComponent,
    FormRegisterAdminComponent,
    TableModule,
    ButtonModule,
    DialogModule,
    VerHistoriaClinicaComponent,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [slideInRightAnimation],
})
export class UsersComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  userService = inject(UserService);
  favoritoService = inject(FavoritoService);
  router = inject(Router);

  errorMessage = '';

  itemsAction: MenuItem[] | undefined;
  itemsRole: MenuItem[] | undefined;

  action!: MenuItem;
  role!: MenuItem;

  users: IUser[] = [];

  userKeys: string[] = [];

  visibleHistoria = false;
  pacienteSeleccionado!: IPaciente;

  loaderState = {
    loading: false,
    state: 'check',
  };

  isAdmin: boolean = false;
  currentUser!: IUser;

  ngOnInit() {
    this.itemsAction = [
      { label: 'Crear', icon: 'pi pi-user-plus' },
      { label: 'Listar', icon: 'pi pi-home' },
    ];

    this.itemsRole = [
      { label: 'paciente', icon: 'pi pi-user' },
      { label: 'especialista', icon: 'pi pi-heart' },
      { label: 'admin', icon: 'pi pi-key' },
    ];

    this.action = this.itemsAction[0];
    this.role = this.itemsRole[0];

    // Get current user and determine if admin
    this.authService.getAuthState().subscribe((user: User | null) => {
      if (user) {
        this.userService
          .getUserByUid(user.uid)
          .then((userData: IUser | null) => {
            if (userData) {
              this.currentUser = userData;
              this.isAdmin = this.currentUser.role === 'admin';
              this.getUsers();
            }
          });
      } else {
        // Handle unauthenticated state
        this.isAdmin = false;
        this.getUsers();
      }
    });
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
    if (this.role?.label != 'especialista') data.data.estaHabilitado = false;
    console.log(data);
    this.storageService.uploadMultiple(data.files).subscribe({
      next: (urlsObject: any) => {
        const keys = Object.keys(urlsObject);
        for (let key of keys) {
          data.data[key] = urlsObject[key];
        }
        this.authService.singUp(data.data).subscribe({
          next: (_) => {
            this.loaderState.state = 'check';
            setTimeout(() => {
              this.loaderState.state = 'loading';
              this.loaderState.loading = false;
            }, 1500);
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

  async getUsers() {
    this.userService.getUsersByRole(this.role.label!).then((users) => {
      this.users = users;
      if (users.length > 0) {
        this.userKeys = Object.keys(users[0]);
      }
    });
  }

  async deshabilitar(user: IEspecialista) {
    const response = await this.userService.updateEstaHabilitado(user, false);
    if (response) user.estaHabilitado = false;
  }

  async habilitar(user: IEspecialista) {
    const response = await this.userService.updateEstaHabilitado(user, true);
    if (response) user.estaHabilitado = true;
  }

  verHistoriaClinica(paciente: IPaciente) {
    this.visibleHistoria = true;
    this.pacienteSeleccionado = paciente;
  }

  // Method to export users to Excel
  exportUsersToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  downloadUserAppointments(user: IUser): void {
    this.userService
      .getUserAppointments(user)
      .then((appointments: ITurno[]) => {
        if (!appointments || appointments.length === 0) {
          console.log('No se encontraron turnos para este usuario.');
          return;
        }

        // Mapea los datos para asegurar que sean planos
        const data = appointments.map((appointment) => ({
          Fecha: appointment.fecha.toLocaleString(),
          Paciente: appointment.paciente.nombre,
          Especialista: appointment.especialista.nombre,
          Especialidad: appointment.especialidad,
          Estado: appointment.estado,
          Comentario: appointment.comentario || '',
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
        XLSX.writeFile(wb, `turnos_${user.nombre}.xlsx`);
      })
      .catch((error) => {
        console.error('Error al obtener los turnos:', error);
      });
  }

  // Method to toggle favorite user
  toggleFavorite(user: IUser, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.favoritoService.toggleFavoriteUser(user);
  }

  // Method to check if user is favorite
  isFavorite(user: IUser): boolean {
    return this.favoritoService.isFavoriteUser(user);
  }

  // Method to handle user selection
  onSelectUser(user: IUser): void {
    this.downloadUserAppointments(user);
  }

  // Method to export pacientes to CSV
  exportPacientesToCsv(): void {
    const pacientes = this.users as IPaciente[];

    const headers = Object.keys(pacientes[0]);
    const csvContent = pacientes.map((paciente) => {
      return headers
        .map((header) => this.formatCsvValue((paciente as any)[header]))
        .join(',');
    });

    csvContent.unshift(headers.join(','));
    const csvString = csvContent.join('\r\n');
    this.downloadCsv(csvString, 'pacientes.csv');
  }

  private formatCsvValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private downloadCsv(csvString: string, filename: string): void {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
