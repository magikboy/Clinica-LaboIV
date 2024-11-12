import { Component, inject, Input, OnInit } from '@angular/core';
import { IPaciente, IUser } from '../../interfaces/user.interface';
import { ITurno } from '../../interfaces/turno.interface';
import { TurnoService } from '../../services/turno.service';
import { AccordionModule } from 'primeng/accordion';
import { TurnoHeaderPipe } from '../../pipes/turno-header.pipe';
import { ButtonModule } from 'primeng/button';
import { IHistoriaClinica } from '../../interfaces/historia_clinica.interface';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-ver-historia-clinica',
  standalone: true,
  imports: [
    AccordionModule,
    TurnoHeaderPipe,
    ButtonModule,
  ],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrl: './ver-historia-clinica.component.css'
})
export class VerHistoriaClinicaComponent implements OnInit {
  @Input() paciente! : IPaciente;

  turnosService = inject(TurnoService);
  _dateDisplayPipe = inject(DateDisplayPipe);
  
  turnos : ITurno[] = [];

  ngOnInit(): void {
    this.turnosService.getTurnosRoleUid('paciente', this.paciente.uid)
    .subscribe(
      (turnos) => {
        this.turnos = turnos.filter((turno) => turno.historiaClinica);
      }
    );
  }

  generateHistoriaClinicaPdf(historia: IHistoriaClinica): void {
    const doc = new jsPDF();

    const patientName = `${this.paciente.nombre} ${this.paciente.apellido}`;

    const logoData = 'assets/logo_clinica.png';
    doc.addImage(logoData, 'PNG', 70, 10, 50, 50);

    doc.setFontSize(16);
    doc.text('Historia Clinica', 76, 70);
    
    doc.setFontSize(12);
    doc.text(`Paciente: ${patientName}`, 10, 80);
    
    const currentDate = this._dateDisplayPipe.transform(new Date());
    doc.text(`Fecha: ${currentDate}`, 10, 90);
    
    doc.text('Datos Fijos:', 10, 110);
    doc.text(`Altura: ${historia.altura} cm`, 10, 120);
    doc.text(`Peso: ${historia.peso} kg`, 10, 130);
    doc.text(`Temperatura: ${historia.temperatura} °C`, 10, 140);
    doc.text(`Presion: ${historia.presion}`, 10, 150);
    
    doc.text('Datos Dinamicos:', 10, 170);
    historia.datosDinamicos.forEach((dato, index) => {
      doc.text(`${dato.clave}: ${dato.valor}`, 10, 180 + (index * 10));
    });

    doc.save(`${patientName}_${currentDate}_HistoriaClinica.pdf`);
  }
}
