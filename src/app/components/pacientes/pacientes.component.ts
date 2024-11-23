import { Component, inject, OnInit } from '@angular/core';
import { ITurno } from '../../interfaces/turno.interface';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { IPaciente } from '../../interfaces/user.interface';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { VerHistoriaClinicaComponent } from '../ver-historia-clinica/ver-historia-clinica.component';
import { TableModule } from 'primeng/table';
import { fadeInAnimation } from '../../animations/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    VerHistoriaClinicaComponent,
    TableModule,
  ],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  animations: [fadeInAnimation],
})
export class PacientesComponent implements OnInit {
  turnoService = inject(TurnoService);
  authService = inject(AuthService);
  visibleHistoria = false;
  pacienteSeleccionado!: IPaciente;
  pacientes: IPaciente[] = [];
  user = this.authService.currentUserSignal()!;

  ngOnInit(): void {
    this.turnoService
      .getTurnosRoleUid('especialista', this.user.uid)
      .subscribe((turnos) => {
        const pacientesAtendidos = new Map<string, ITurno[]>();

        for (let turno of turnos) {
          const pacienteUid = turno.pacienteUid;
          if (!pacientesAtendidos.has(pacienteUid)) {
            pacientesAtendidos.set(pacienteUid, []);
          }
          pacientesAtendidos.get(pacienteUid)!.push(turno);
        }

        this.pacientes = Array.from(pacientesAtendidos.entries()).map(
          ([_, turnos]) => ({
            ...turnos[0].paciente,
            turnos: turnos.sort(
              (a, b) =>
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            ),
          })
        );
      });
  }

  verHistoriaClinica(paciente: IPaciente) {
    this.visibleHistoria = true;
    this.pacienteSeleccionado = paciente;
  }

  getUltimosTurnos(paciente: IPaciente): ITurno[] {
    return paciente.turnos?.slice(0, 3) || [];
  }
}
