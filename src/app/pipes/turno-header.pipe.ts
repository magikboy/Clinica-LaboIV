import { inject, Pipe, PipeTransform } from '@angular/core';
import { ITurno } from '../interfaces/turno.interface';
import { DateDisplayPipe } from './date-display.pipe';

@Pipe({
  name: 'turnoHeader',
  standalone: true
})
export class TurnoHeaderPipe implements PipeTransform {
  dateDisplay = inject(DateDisplayPipe);
  transform(turno: ITurno): string {
    return `${turno.especialidad.toUpperCase()} | ${this.dateDisplay.transform(turno.fecha)}`;
  }

}
