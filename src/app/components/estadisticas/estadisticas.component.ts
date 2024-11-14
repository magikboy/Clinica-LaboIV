import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Chart, ChartConfiguration, registerables } from 'chart.js'
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { ITurno } from '../../interfaces/turno.interface';
import { CalendarModule } from 'primeng/calendar';
import { Iingreso } from '../../interfaces/ingreso.interface';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { StatNumberDirective } from '../directives/stat-number.directive';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    StatNumberDirective,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
  turnoService = inject(TurnoService);
  authService = inject(AuthService);
  turnos : ITurno[] = [];
  ingresos : Iingreso[] = [];
  rangeDates: Date[] = [new Date(), new Date()];
  options = [
    {name: 'Log de ingresos al sistema', value: 1},
    {name: 'Cantidad de turnos por especialidad', value: 2},
    {name: 'Cantidad de turnos por día', value: 3},
    {name: 'Cantidad de turnos solicitado por médico en un lapso de tiempo', value: 4},
    {name: 'Cantidad de turnos finalizados por médico en un lapso de tiempo', value: 5},    
  ];
  selectedView = 'estadisticas';
  chart! : Chart;
  data : {
    [key: string]: any;
  } = {};
  selectedOption: any;
  config : ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Turnos',
          backgroundColor: 'blue',
          data: [200, 100, 300, 150, 400, 50],
        }
      ]
    }
  };

  getKeys() : string[] {
    return Object.keys(this.data);
  }
  

  ngOnInit(): void {
    this.turnoService.getAll()
    .subscribe(
      (turnos) => {
        this.turnos = turnos; 
      }
    );

    this.authService.getIngresos()
    .subscribe(
      (ingresos) => {
        this.ingresos = ingresos; 
      }
    );
  }



  verEstadisticas() {
    this.selectedView = 'estadisticas';
  }

  verGrafico() {
    this.selectedView = 'grafico';
      this.loadGrafico();
  }

  loadGrafico() {
    setTimeout(
      () => {
          this.chart = new Chart('chart', this.config)
      },
      150
    );
  }

  changeOption() {
    console.log(this.selectedOption);
    switch (this.selectedOption.value) {
      case 1:
        this.calcularCantIngresosDia();
        break;
      case 2:
        this.calcularCantTurnosEsp();
        break;
      case 3:
        this.calcularCantTurnosDia();
        break;
      case 4:
        this.calcularSolicitadosMedico();
        break;
      case 5:
        this.calcularRealizadosMedico();
        break;

    }
  }
  // {name: 'Cantidad de turnos por especialidad', value: 2}
  calcularCantTurnosEsp() {
   this.data = {};

    for (let turno of this.turnos){
      if(this.data[turno.especialidad])
        this.data[turno.especialidad] += 1;
      else 
      this.data[turno.especialidad] = 1;
    }
    this.updateChart('line', 'Turnos');
  }

  calcularSolicitadosMedico() {
    this.data = {};
 
     for (let turno of this.turnos){
      if(turno.fecha >= this.rangeDates[0] && turno.fecha >= this.rangeDates[0])
      {
        const nombreCompleto = `${turno.especialista.nombre} ${turno.especialista.apellido}`;
        if(this.data[nombreCompleto])
          this.data[nombreCompleto] += 1;
        else 
          this.data[nombreCompleto] = 1;
      }
     }
     this.updateChart('bar', 'Turnos');
   }

   calcularRealizadosMedico() {
    this.data = {};
 
     for (let turno of this.turnos){
      if(turno.fecha >= this.rangeDates[0] && turno.fecha >= this.rangeDates[0] && turno.estado == 'realizado')
      {
        const nombreCompleto = `${turno.especialista.nombre} ${turno.especialista.apellido}`;
        if(this.data[nombreCompleto])
          this.data[nombreCompleto] += 1;
        else 
          this.data[nombreCompleto] = 1;
      }
     }
     this.updateChart('', 'Turnos');
   }

   calcularCantTurnosDia() {
    this.data = {};
 
     for (let turno of this.turnos){
      let dateStr : string = `${turno.fecha.getDate()}/${turno.fecha.getMonth()}/${turno.fecha.getFullYear()}`
      if(this.data[dateStr])
        this.data[dateStr] += 1
      else 
        this.data[dateStr] = 1
     }
     this.updateChart('bar', 'Turnos');
   }

   
  calcularCantIngresosDia() {
    this.data = {};

    for (let ingreso of this.ingresos) {
      let dateStr: string = `${ingreso.fecha.getDate()}/${ingreso.fecha.getMonth()}/${ingreso.fecha.getFullYear()}`;
      let timeStr: string = `${ingreso.fecha.getHours()}:${ingreso.fecha.getMinutes()}`;
      let userStr: string = `${ingreso.email} ${ingreso.email}`;
      let key: string = `${dateStr} ${timeStr} ${userStr}`;

      if (this.data[key])
        this.data[key] += 1;
      else
        this.data[key] = 1;
    }
    this.updateChart('bar', 'Ingresos');
  }


  updateChart(type: string, dataLabel : string) {
    const keys = this.getKeys();
    let newLabels : string[] = [];
    let newData : number[] = [];
    for(let key of keys) {
      newLabels.push(key);
      newData.push(this.data[key]);
    }
    this.config.data.labels = newLabels;
    this.config.data.datasets[0].data = newData;
    this.config.data.datasets[0].label = dataLabel;
    if(type == 'line')
      this.config.type = 'line';
    else
      this.config.type = 'bar';

    if(this.selectedView == 'grafico') {
      this.selectedView = 'estadisticas';
      setTimeout(
        () => {
          this.selectedView = 'grafico';
          this.loadGrafico();
        },
        1
      )
    }

  
  }
  generateExcel() {
    const headers = ['Campo', 'Cantidad'];
    const rows = Object.entries(this.data);
    const worksheetData = [headers, ...rows];
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Data': worksheet },
      SheetNames: ['Data']
    };
    
    XLSX.writeFile(workbook, 'estadisticas.xlsx');
  }

  generatePdf() {
    const doc = new jsPDF();
    const base64Img = this.chart.toBase64Image('PNG', 1000);

    doc.addImage(base64Img, 'PNG', 10, 10, 200, 100);

    doc.text(this.selectedOption.name, 10, 120);

    doc.save('grafico.pdf');
  }
}
