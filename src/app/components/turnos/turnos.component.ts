import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ITurno } from '../../interfaces/turno.interface';
import { AuthService } from '../../services/auth.service';
import { TurnoService } from '../../services/turno.service';

@Component({
  selector: 'app-turnos',
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
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {
  authService = inject(AuthService);
  turnoService = inject(TurnoService);
  role!: string;
  turnos: ITurno[] = []
  visibleComentario = false;
  motivoComentario = '';
  nuevoEstado = '';
  nuevoComentario = '';
  turnoAModificar: ITurno | null = null;
  query = '';
  filterBy = 'especialidad';

  constructor() {
    const user = this.authService.currentUserSignal()!
    this.role = user.role;
    this.turnoService.getAll()
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

  getFilteredTurnos(): ITurno[] {
    if (this.filterBy == 'paciente' || this.filterBy == 'especialista')
    {
      return this.turnos.filter((turno) => {
        let nombreCompleto : string = `${turno[this.filterBy].nombre} ${turno[this.filterBy].apellido}`;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(this.query.toLowerCase())
      });
    }
    return this.turnos.filter((turno) => turno[this.filterBy].toLowerCase().includes(this.query.toLowerCase()));
  }

  puedeCancelar(turno : ITurno) : boolean {
      return turno.estado != 'aceptado' && turno.estado != 'realizado' && turno.estado != 'rechazado' && turno.estado != 'cancelado';
  }

  cancelar(turno: ITurno) {
    this.nuevoEstado = 'cancelado';
    this.motivoComentario = 'cancelar';
    this.turnoAModificar = turno;
    this.visibleComentario = true;
  }

  changeFilter(newFilter: string) {
    this.filterBy = newFilter;
  }

  puedeConfirmar() {
    return this.nuevoComentario.length < 1;
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
  
}
