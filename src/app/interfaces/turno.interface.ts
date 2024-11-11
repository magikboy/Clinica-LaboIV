import { IPregunta } from "./encuesta.interface";
import { IEspecialista, IPaciente } from "./user.interface";

export interface ITurno {
    [key: string]: any;
    id: string,
    fecha: Date,
    pacienteUid: string,
    especialistaUid: string,
    estado: string,
    comentario: string | null,
    review: string | null,
    especialista : IEspecialista,
    especialidad : string,
    paciente : IPaciente,
    encuesta : IPregunta[] | null,
}