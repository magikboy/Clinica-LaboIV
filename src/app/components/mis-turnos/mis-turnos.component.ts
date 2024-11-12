import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { TurnoService } from '../../services/turno.service';
import { ITurno } from '../../interfaces/turno.interface';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IPregunta } from '../../interfaces/encuesta.interface';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormHistoriaClinicaComponent } from '../form-historia-clinica/form-historia-clinica.component';
import { IHistoriaClinica } from '../../interfaces/historia_clinica.interface';
import { DatePipe } from '@angular/common';
import { slideInAnimation } from '../../animations/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DateDisplayPipe,
    DialogModule,
    FormsModule,
    InputTextModule,
    ToolbarModule,
    InputGroupModule,
    FormHistoriaClinicaComponent,
  ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
  animations: [
    slideInAnimation
  ]
})
export class MisTurnosComponent {
  authService = inject(AuthService);
  turnoService = inject(TurnoService);
  _dateDisplay = inject(DateDisplayPipe);
  role!: string;
  turnos: ITurno[] = []
  visibleComentario = false;
  visibleReview = false;
  visibleDejarReview = false;
  visibleEncuesta = false;
  visibleHistoria = false;
  motivoComentario = '';
  nuevoEstado = '';
  nuevoComentario = '';
  turnoAModificar: ITurno | null = null;
  query = '';
  filterBy = 'especialidad';
  datosDinamicos = false;
  campoAdicional = '';

  historiaFijaFilters = ['altura', 'temperatura', 'peso', 'presion'];



  encuesta: IPregunta[] = [
    {
      pregunta: '¿Como fue la atencion del especialista?',
      respuesta: ''
    },
    {
      pregunta: '¿La atencion de la administracion fue buena?',
      respuesta: ''
    },
    {
      pregunta: '¿Hay algo que mejorarias de la clinica?',
      respuesta: ''
    },

  ];


  constructor() {
    const user = this.authService.currentUserSignal()!
    this.role = user.role;
    this.turnoService.getTurnosRoleUid(this.role, user.uid)
      .subscribe(
        {
          next: (turnos) => {
            this.turnos = turnos;
          },
          error: (err) => {
            console.log(err);
          }
        }
      );
  }

  changeFilter(newFilter: string) {
    this.filterBy = newFilter;
  }

  changeFilterCampoInterno(newFilter: string, campoAdicional : string, datosDinamicos : boolean) {
    this.filterBy = newFilter;
    this.datosDinamicos = datosDinamicos;
    this.campoAdicional = campoAdicional;
  }

  getFilteredTurnos(): ITurno[] {
    if(this.query.length == 0) return this.turnos;

    if (this.filterBy == 'paciente' || this.filterBy == 'especialista') {
      return this.turnos.filter((turno) => {
        let nombreCompleto: string = `${turno[this.filterBy].nombre} ${turno[this.filterBy].apellido}`;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(this.query.toLowerCase())
      });
    }
    if(this.filterBy == 'historiaClinica') {
      return this.turnos.filter((turno) => {
        if(!turno.historiaClinica) return false;

        if(this.datosDinamicos) {
          for(let datoDinamico of turno.historiaClinica.datosDinamicos)
          {
            if (datoDinamico.clave == this.campoAdicional)
            {
              let valor: string = `${datoDinamico.valor}`;
              valor = valor.toLowerCase();
              return valor.includes(this.query.toLowerCase());
            }
          }
          return false;
        }
        else {
          let valor: string = `${turno.historiaClinica[this.campoAdicional]}`;
          valor = valor.toLowerCase();
          return valor.includes(this.query.toLowerCase());
        }
      });
    }
    else if (this.filterBy == 'fecha') {
      return this.turnos.filter((turno) => {
        let fechaStr = this._dateDisplay.transform(turno.fecha);
        return fechaStr.toLowerCase().includes(this.query.toLowerCase())
      });
    }
    return this.turnos.filter((turno) => turno[this.filterBy].toLowerCase().includes(this.query.toLowerCase()));
  }

  getHistoriaDinamicoFilters() : string[] {
    const filters : string[] = [];

    for(let turno of this.turnos) {
      if(turno.historiaClinica)
      {
        for(let datoDinamico of turno.historiaClinica.datosDinamicos){
          if(!filters.includes(datoDinamico.clave)) {
            filters.push(datoDinamico.clave);
          }
        }
      }
    }

    return filters;
  }

  getNombre(turno: ITurno): string {
    if (this.role == 'paciente') {
      return `${turno.especialista.nombre} ${turno.especialista.apellido}`
    }

    return `${turno.paciente.nombre} ${turno.paciente.apellido}`
  }

  getImg(turno: ITurno): string {
    if (this.role == 'paciente') {
      return turno.especialista.imagenPerfil
    }

    return turno.paciente.imagenPerfil
  }

  puedeCancelar(turno: ITurno): boolean {
    if (this.role == 'paciente') {
      return turno.estado != 'realizado' && turno.estado != 'cancelado' && turno.estado != 'rechazado';
    }
    else {
      return turno.estado != 'aceptado' && turno.estado != 'realizado' && turno.estado != 'rechazado' && turno.estado != 'cancelado';
    }
  }

  puedeVerComentario(turno: ITurno): boolean {
    if (turno.comentario || turno.review)
      return true;

    return false;
  }

  puedeCompletarEncuesta(turno: ITurno): boolean {
    if (this.role == 'paciente' && turno.estado == 'realizado' && turno.comentario && !turno.encuesta) {
      return true;
    }

    return false;
  }

  puedeCalificarAtencion(turno: ITurno): boolean {
    if (this.role == 'paciente' && turno.estado == 'realizado' && !turno.review)
      return true;

    return false;
  }

  puedeRechazar(turno: ITurno): boolean {
    if (this.role == 'especialista' && turno.estado == 'pendiente')
      return true;

    return false;
  }

  puedeAceptar(turno: ITurno): boolean {
    if (this.role == 'especialista' && turno.estado == 'pendiente')
      return true;

    return false;
  }

  puedeFinalizar(turno: ITurno): boolean {
    if (this.role == 'especialista' && turno.estado == 'aceptado')
      return true;

    return false;
  }

  puedeDejarHistoriaClinica(turno: ITurno) {
    if (this.role == 'especialista' && turno.estado == 'realizado' && !turno.historiaClinica)
      return true;
    return false;
  }

  cancelar(turno: ITurno) {
    this.nuevoEstado = 'cancelado';
    this.motivoComentario = 'cancelar';
    this.turnoAModificar = turno;
    this.visibleComentario = true;
  }

  rechazar(turno: ITurno) {
    this.nuevoEstado = 'rechazado';
    this.motivoComentario = 'rechazar';
    this.turnoAModificar = turno;
    this.visibleComentario = true;
  }

  aceptar(turno: ITurno) {
    this.turnoAModificar = turno;
    this.turnoService.update(
      this.turnoAModificar!,
      {
        estado: 'aceptado',
      }
    )
      .then(
        () => {

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      );
  }

  finalizar(turno: ITurno) {
    this.nuevoEstado = 'realizado';
    this.motivoComentario = 'finalizar';
    this.turnoAModificar = turno;
    this.visibleComentario = true;
  }

  dejarHistoriaClinica(turno: ITurno) {
    this.nuevoEstado = 'realizado';
    this.motivoComentario = 'finalizar';
    this.turnoAModificar = turno;
    this.visibleHistoria = true;
  }

  verReview(turno: ITurno) {
    this.turnoAModificar = turno;
    this.visibleReview = true;
  }

  dejarReview(turno: ITurno) {
    this.turnoAModificar = turno;
    this.visibleDejarReview = true;
  }

  mostrarEncuesta(turno: ITurno) {
    this.turnoAModificar = turno;
    this.visibleEncuesta = true;
  }

  confirmarComentario() {
    this.turnoAModificar
    this.turnoService.update(
      this.turnoAModificar!,
      {
        estado: this.nuevoEstado,
        comentario: this.nuevoComentario,
      }
    )
      .then(
        () => {

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      );
    this.visibleComentario = false;
    this.nuevoComentario = '';
  }

  confirmarReview() {
    this.turnoAModificar
    this.turnoService.update(
      this.turnoAModificar!,
      {
        review: this.nuevoComentario,
      }
    )
      .then(
        () => {

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      );
    this.visibleDejarReview = false;
    this.nuevoComentario = '';
  }

  puedeConfirmar() {
    return this.nuevoComentario.length < 1;
  }

  clearEncuesta() {
    for (let pregunta of this.encuesta) {
      pregunta.respuesta = '';
    }
  }

  puedeEnviarEncuesta() {
    for (let pregunta of this.encuesta) {
      if (pregunta.respuesta.length < 1)
        return true;
    }
    return false;
  }

  enviarEncuesta() {
    this.turnoAModificar
    this.turnoService.update(
      this.turnoAModificar!,
      {
        encuesta: this.encuesta,
      }
    )
      .then(
        () => {

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
    );
    this.visibleEncuesta = false;
    this.clearEncuesta();
  }

  enviarHistoriaClinica(historiaClinica: IHistoriaClinica) {
    this.turnoAModificar
    this.turnoService.update(
      this.turnoAModificar!,
      {
        historiaClinica: historiaClinica,
      }
    )
      .then(
        () => {

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
    );
    this.visibleHistoria = false;
  }

  getSearchingString() : string {
    let str = 'Buscando por ' + this.filterBy;
    if(this.filterBy == 'historiaClinica') {
      str += ': ' + this.campoAdicional;
    }
    return str;
  }
}
