import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEspecialista, IPaciente } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { HorariosService } from '../../services/horarios.service';
import { ITurno } from '../../interfaces/turno.interface';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css'],
})
export class SolicitarTurnoComponent implements OnInit {
  private userService = inject(UserService);
  private horariosService = inject(HorariosService);
  private turnoService = inject(TurnoService);
  private authService = inject(AuthService);

  horariosSeleccionados: Map<string, boolean> = new Map<string, boolean>();

  especialistas: IEspecialista[] = [];
  specialities: string[] = [];
  turnos: ITurno[] = [];
  selectedEspecialista: IEspecialista | null = null;
  selectedEspecialidad: string | null = null;
  selectedDay: Date | null = null;
  fechasEspecialista: any = null;
  turnsPerDay: Map<string, number> = new Map<string, number>();
  cantConsultorios = 1;
  selectedPaciente: IPaciente | null = null;
  users: IPaciente[] = [];
  workingDays = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];

  successMessage: string = '';
  errorMessage: string = '';

  dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  };

  ngOnInit(): void {
    // If the current user is a patient, automatically select them
    if (this.authService.currentUserSignal()?.role == 'paciente') {
      this.selectedPaciente =
        this.authService.currentUserSignal()! as IPaciente;
    } else {
      // If not a patient, load all patients for selection
      this.userService.getUsersByRole('paciente').then((users) => {
        this.users = users as IPaciente[];
      });
    }

    this.loadEspecialistas();
    this.turnoService.getAll().subscribe((turnos) => {
      this.turnos = turnos;
      this.turnsPerDay.clear();
      for (let turno of turnos) {
        const formattedDate = turno.fecha.toLocaleString(
          'en-US',
          this.dateOptions
        );
        this.turnsPerDay.set(
          formattedDate,
          (this.turnsPerDay.get(formattedDate) || 0) + 1
        );
      }
    });
  }

  // Load all specialists and their specialities
  async loadEspecialistas(): Promise<void> {
    this.especialistas = (await this.userService.ObtenerUsuarios(
      'role',
      'especialista'
    )) as IEspecialista[];
    this.specialities = this.getAllUniqueSpecialities();
  }

  // Patient selection method (Needed for admin/staff scenario)
  selectPaciente(paciente: IPaciente) {
    this.selectedPaciente = paciente;
  }

  // Selecting a speciality
  selectEspecialidad(especialidad: string) {
    this.selectedEspecialidad = especialidad;
    // Reset the specialist selection
    this.selectedEspecialista = null;
    this.selectedDay = null;
  }

  // Selecting a specialist
  selectEspecialista(especialista: IEspecialista) {
    this.selectedEspecialista = especialista;
    this.selectedDay = null; // reset day selection
    this.getHorarios();
  }

  // Retrieve the schedules for the selected specialist
  async getHorarios(): Promise<void> {
    if (!this.selectedEspecialista) return;

    const horarios = await this.horariosService.ObtenerHorarios(
      'uid',
      this.selectedEspecialista.uid
    );
    const fechas = this.getNext15Days();

    for (let day of this.workingDays) {
      if (fechas[day]) {
        fechas[day].horarios = horarios[day] || [];
      }
    }

    this.fechasEspecialista = fechas;
  }

  // Selecting a day for the appointment
  selectDay(day: Date) {
    this.selectedDay = day;
  }

  // Gather all unique specialities from the specialists list
  getAllUniqueSpecialities(): string[] {
    const specialitiesSet = new Set<string>();
    for (let esp of this.especialistas) {
      for (let speciality of esp.especialidades) {
        specialitiesSet.add(speciality);
      }
    }
    return Array.from(specialitiesSet);
  }

  // Filter specialists based on the selected speciality
  getFilteredEspecialistasByEspecialidad(): IEspecialista[] {
    if (!this.selectedEspecialidad) return [];
    return this.especialistas.filter((esp) => {
      return esp.especialidades.includes(this.selectedEspecialidad!);
    });
  }

  // Generate a list of days for the next 15 days
  getNext15Days(): any {
    const today = new Date();
    const daysOfWeek = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];
    const result: any = {
      lunes: { fechas: [] },
      martes: { fechas: [] },
      miercoles: { fechas: [] },
      jueves: { fechas: [] },
      viernes: { fechas: [] },
      sabado: { fechas: [] },
      domingo: { fechas: [] },
    };

    for (let i = 0; i < 15; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      const dayIndex = currentDay.getDay();
      const dayName = daysOfWeek[dayIndex];
      if (result[dayName]) {
        result[dayName].fechas.push(new Date(currentDay));
      }
    }

    return result;
  }

  // Format the date as dd/mm
  getFormattedDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  // Retrieve the available schedules (horarios) for the selected day
  getAvailableHorarios(): string[] {
    if (
      !this.selectedEspecialista ||
      !this.selectedEspecialidad ||
      !this.selectedDay ||
      !this.fechasEspecialista
    ) {
      return [];
    }

    const dayName = this.workingDays[this.selectedDay.getDay()];
    return this.fechasEspecialista[dayName]?.horarios || [];
  }

  // Determine remaining slots for a given schedule
  getRemainingTurn(horario: string, date: Date): number {
    const splittedHorario = horario.split(':');
    const hour = parseInt(splittedHorario[0]);
    const minutes = parseInt(splittedHorario[1]);

    let fecha = new Date(date);
    fecha.setHours(hour, minutes, 0, 0);

    const formattedDate = fecha.toLocaleString('en-US', this.dateOptions);

    const amount = this.turnsPerDay.get(formattedDate) || 0;
    return Math.max(this.cantConsultorios - amount, 0);
  }

  // Format schedule time as hh:mmam/pm
  formatHorario(horario: string): string {
    const [rawHour, rawMinute] = horario.split(':');
    let hour = parseInt(rawHour, 10);
    const minute = parseInt(rawMinute, 10);
    const amPm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}${amPm}`;
  }

  async solicitarTurno(horario: string) {
    if (
      !this.selectedDay ||
      !this.selectedEspecialista ||
      !this.selectedPaciente
    ) {
      return;
    }

    const splittedHorario = horario.split(':');
    const hour = parseInt(splittedHorario[0]);
    const minutes = parseInt(splittedHorario[1]);

    let fecha = new Date(this.selectedDay);
    fecha.setHours(hour, minutes, 0, 0);

    try {
      await this.turnoService.addTurno({
        pacienteUid: this.selectedPaciente.uid,
        especialistaUid: this.selectedEspecialista.uid,
        fecha: fecha,
        estado: 'pendiente',
        comentario: null,
        especialista: this.selectedEspecialista,
        paciente: this.selectedPaciente,
      });

      // Marcar el horario como seleccionado
      const formattedHorario = `${this.getFormattedDate(
        this.selectedDay
      )} ${this.formatHorario(horario)}`;
      this.horariosSeleccionados.set(formattedHorario, true);

      // Mostrar mensaje de éxito en la interfaz
      this.successMessage = `¡Turno solicitado exitosamente para el ${this.getFormattedDate(
        fecha
      )} a las ${this.formatHorario(horario)}!`;
      setTimeout(() => {
        this.successMessage = ''; // Limpiar el mensaje después de unos segundos
      }, 5000);
    } catch (error) {
      console.error('Error al solicitar turno:', error);
      this.errorMessage =
        'Hubo un error al solicitar el turno. Por favor, inténtelo nuevamente.';
      setTimeout(() => {
        this.errorMessage = ''; // Limpiar el mensaje después de unos segundos
      }, 5000);
    }
  }
}
