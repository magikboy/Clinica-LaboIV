export interface IHorarios {
    [key: string]: any;
    id?: string,
    uid?: string,
    lunes: string[],
    martes: string[],
    miercoles: string[],
    viernes: string[],
    jueves: string[],
    sabado: string[],
}

const diaSemana = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
];

const finDeSemana = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00",
];

export const defaultHorarios  = {
    lunes: [... diaSemana],
    martes: [... diaSemana],
    miercoles: [... diaSemana],
    viernes: [... diaSemana],
    jueves: [... diaSemana],
    sabado: [... finDeSemana],
};