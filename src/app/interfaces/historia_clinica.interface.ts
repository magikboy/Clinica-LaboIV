export interface IHistoriaClinica {
    [key: string]: any;
    altura: number,
    peso: number,
    temperatura: number,
    presion: number,
    datosDinamicos: IDatosDinamicos[],
}

export interface IDatosDinamicos {
    clave: string,
    valor: any,
}