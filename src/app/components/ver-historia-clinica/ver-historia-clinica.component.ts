import { Component, inject, Input, OnInit } from '@angular/core';
import { IPaciente } from '../../interfaces/user.interface';
import { ITurno } from '../../interfaces/turno.interface';
import { TurnoService } from '../../services/turno.service';
import { AccordionModule } from 'primeng/accordion';
import { TurnoHeaderPipe } from '../../pipes/turno-header.pipe';
import { ButtonModule } from 'primeng/button';
import { IHistoriaClinica } from '../../interfaces/historia_clinica.interface';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import jsPDF from 'jspdf';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface EspecialidadOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-ver-historia-clinica',
  standalone: true,
  imports: [
    AccordionModule,
    TurnoHeaderPipe,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrls: ['./ver-historia-clinica.component.css'],
})
export class VerHistoriaClinicaComponent implements OnInit {
  @Input() paciente!: IPaciente;

  turnosService = inject(TurnoService);
  _dateDisplayPipe = inject(DateDisplayPipe);

  turnos: ITurno[] = [];
  especialidades: EspecialidadOption[] = [];
  especialidadSeleccionada!: EspecialidadOption;

  ngOnInit(): void {
    this.turnosService
      .getTurnosRoleUid('paciente', this.paciente.uid)
      .subscribe((turnos) => {
        this.turnos = turnos.filter((turno) => turno.historiaClinica);

        // Verificar las especialidades de los turnos
        this.turnos.forEach((turno) => {
          console.log('Especialidad del turno:', turno.especialidad);
        });

        // Obtener las especialidades únicas de los turnos
        const especialidadesSet = new Set(
          this.turnos.map((turno) => turno.especialidad.trim().toLowerCase())
        );
        this.especialidades = Array.from(especialidadesSet).map((especialidad) => ({
          label: especialidad.charAt(0).toUpperCase() + especialidad.slice(1),
          value: especialidad,
        }));

        console.log('Especialidades disponibles:', this.especialidades);
      });
  }

  descargarAtencionesPorEspecialidad(): void {
    console.log('Especialidad seleccionada:', this.especialidadSeleccionada);

    if (!this.especialidadSeleccionada?.value) {
      alert('Por favor, seleccione una especialidad.');
      return;
    }

    // Filtrar los turnos por la especialidad seleccionada
    const turnosFiltrados = this.turnos.filter(
      (turno) =>
        turno.especialidad.trim().toLowerCase() ===
        this.especialidadSeleccionada.value
    );

    console.log('Turnos filtrados:', turnosFiltrados);

    if (turnosFiltrados.length === 0) {
      alert('No hay atenciones para la especialidad seleccionada.');
      return;
    }

    // Generar el PDF con los turnos filtrados
    this.generateAtencionesPdf(turnosFiltrados);
  }

  generateAtencionesPdf(turnos: ITurno[]): void {
    const doc = new jsPDF();

    const patientName = `${this.paciente.nombre} ${this.paciente.apellido}`;
    const currentDate = this._dateDisplayPipe.transform(new Date());

    // Agregar el logo de la clínica
    const logoData = 'assets/logo_clinica.png';
    doc.addImage(logoData, 'PNG', 10, 10, 50, 20);

    // Título del informe
    doc.setFontSize(18);
    doc.text('Atenciones por Especialidad', 70, 20);

    // Fecha de emisión
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${currentDate}`, 70, 30);

    // Datos del paciente y especialidad
    doc.text(`Paciente: ${patientName}`, 10, 50);
    doc.text(
      `Especialidad: ${this.especialidadSeleccionada.label}`,
      10,
      60
    );

    // Listar las atenciones
    let yPosition = 80;
    turnos.forEach((turno, index) => {
      doc.setFontSize(12);
      doc.text(`Atención ${index + 1}:`, 10, yPosition);
      yPosition += 10;
      doc.text(
        `- Fecha: ${this._dateDisplayPipe.transform(turno.fecha)}`,
        15,
        yPosition
      );
      yPosition += 10;

      const profesionalNombre = turno['profesional']?.nombre || 'N/A';
      const profesionalApellido = turno['profesional']?.apellido || 'N/A';

      doc.text(
        `- Profesional: ${profesionalNombre} ${profesionalApellido}`,
        15,
        yPosition
      );
      yPosition += 10;

      // Verificar si hay historia clínica
      if (turno.historiaClinica) {
        doc.text(`- Altura: ${turno.historiaClinica.altura} cm`, 15, yPosition);
        yPosition += 10;
        doc.text(`- Peso: ${turno.historiaClinica.peso} kg`, 15, yPosition);
        yPosition += 10;
        doc.text(`- Temperatura: ${turno.historiaClinica.temperatura} °C`, 15, yPosition);
        yPosition += 10;
        doc.text(`- Presión: ${turno.historiaClinica.presion}`, 15, yPosition);
        yPosition += 10;

        // Agregar datos dinámicos si existen
        if (turno.historiaClinica.datosDinamicos?.length > 0) {
          doc.text('- Datos Dinámicos:', 15, yPosition);
          yPosition += 10;
          turno.historiaClinica.datosDinamicos.forEach((dato) => {
            doc.text(`  ${dato.clave}: ${dato.valor}`, 15, yPosition);
            yPosition += 10;
          });
        }
      }

      yPosition += 10;

      // Verificar si se alcanza el final de la página
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(
      `${patientName}_${currentDate}_Atenciones_${this.especialidadSeleccionada.label}.pdf`
    );
  }

  generateHistoriaClinicaPdf(historia: IHistoriaClinica): void {
    const doc = new jsPDF();

    const patientName = `${this.paciente.nombre} ${this.paciente.apellido}`;
    const currentDate = this._dateDisplayPipe.transform(new Date());

    // Agregar el logo de la clínica
    const logoData = 'assets/logo_clinica.png';
    doc.addImage(logoData, 'PNG', 10, 10, 50, 20);

    // Título del informe
    doc.setFontSize(18);
    doc.text('Historia Clínica', 70, 20);

    // Fecha de emisión
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${currentDate}`, 70, 30);

    // Datos del paciente
    doc.text(`Paciente: ${patientName}`, 10, 50);

    // Datos Fijos
    doc.setFontSize(14);
    doc.text('Datos Fijos:', 10, 70);
    doc.setFontSize(12);
    doc.text(`Altura: ${historia.altura} cm`, 10, 80);
    doc.text(`Peso: ${historia.peso} kg`, 10, 90);
    doc.text(`Temperatura: ${historia.temperatura} °C`, 10, 100);
    doc.text(`Presión: ${historia.presion}`, 10, 110);

    // Datos Dinámicos
    if (historia.datosDinamicos && historia.datosDinamicos.length > 0) {
      doc.setFontSize(14);
      doc.text('Datos Dinámicos:', 10, 130);
      doc.setFontSize(12);
      let yPosition = 140;
      historia.datosDinamicos.forEach((dato) => {
        doc.text(`${dato.clave}: ${dato.valor}`, 10, yPosition);
        yPosition += 10;
        // Verificar si se alcanza el final de la página
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    doc.save(`${patientName}_${currentDate}_HistoriaClinica.pdf`);
  }
}