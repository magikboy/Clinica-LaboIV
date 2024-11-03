import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { HorariosService } from '../../services/horarios.service';
import { IHorarios } from '../../interfaces/horarios.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  authService = inject(AuthService);
  horariosService = inject(HorariosService);
  user = this.authService.currentUserSignal()!;
  imagenSeleccionada = 'imagenPerfil';
  estaViendoHorarios = false;
  mapHorarios! : IMapHorarios;
  horarios! : IHorarios;

  diaSemana = ["lunes",
    "martes",
    "miercoles",
    "viernes",
    "jueves",
    "sabado",];

  horariosDiaSemana = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
  ];

  HorariosfinDeSemana = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00",
  ];

  constructor() {
    if(this.user.role == 'especialista')
    {
      this.getHorarios();
    }
  }
  getImagen(): string {
    return this.user[this.imagenSeleccionada];
  }

  changeImage() {
    if (this.user.role != 'paciente') return;

    if (this.imagenSeleccionada == 'imagenPerfil')
      this.imagenSeleccionada = 'imagenPerfilAux';
    else
      this.imagenSeleccionada = 'imagenPerfil';
  }

  verHorarios() {
    this.estaViendoHorarios = true;
  }

  volver() {
    this.estaViendoHorarios = false;
  }
  
  async getHorarios() {
    this.horarios = await this.horariosService.ObtenerHorarios('uid', this.user.uid);
    this.mapHorarios = {
      lunes: {},
      martes: {},
      miercoles: {},
      jueves: {},
      viernes: {},
      sabado: {},
    };
    this.getHorariosMap();
    
  }
  getHorariosMap() {
    for (let dia of this.diaSemana) {
      if(dia != 'sabado') {
        for (let horario of this.horariosDiaSemana )
        {
          this.mapHorarios[dia][horario] = this.horarios[dia].includes(horario)
        }
      }
      else {
        for (let horario of this.HorariosfinDeSemana )
        {
          this.mapHorarios[dia][horario] = this.horarios[dia].includes(horario)
        }
      }
    }
  }
  toggleHorario(dia : string, horario : string) {
    this.mapHorarios[dia][horario] = !this.mapHorarios[dia][horario];
  }

  clear() {
    for (let dia of this.diaSemana) {
      this.horarios[dia].splice(0, this.horarios[dia].length);
    }

    this.getHorariosMap();
  }

  guardar() {
    for (let dia of this.diaSemana) {
      this.horarios[dia].splice(0, this.horarios[dia].length);
      
      if(dia != 'sabado') {
        for (let horario of this.horariosDiaSemana )
        {
          if (this.mapHorarios[dia][horario]) {
            this.horarios[dia].push(horario);
          }
        }
      }
      else {
        for (let horario of this.HorariosfinDeSemana )
        {
          if (this.mapHorarios[dia][horario]) {
            this.horarios[dia].push(horario);
          }
        }
      }
    }
    this.horariosService.update(this.horarios);
    this.volver();
  }
}



interface IMapHorarios {
  [key: string]: IHorariosBool;
  lunes: IHorariosBool,
  martes: IHorariosBool,
  miercoles: IHorariosBool,
  viernes: IHorariosBool,
  jueves: IHorariosBool,
  sabado: IHorariosBool,
}

interface IHorariosBool {
  [key: string]: boolean;
}