import { ITurno } from './turno.interface';

export interface IUser {
  [key: string]: any;
  uid: string;
  role: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  imagenPerfil: string;
}

export interface IAdmin extends IUser {}

export interface IPaciente extends IUser {
  obraSocial: string;
  imagenPerfilAux: string;
  turnos?: ITurno[]; // Corregido aquí
}

export interface IEspecialista extends IUser {
  especialidades: string[];
  estaHabilitado: boolean;
}
