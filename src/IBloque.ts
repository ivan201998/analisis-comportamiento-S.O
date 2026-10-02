import { Proceso } from './Proceso';

// Contrato publico de una particion de memoria. BloqueMemoria lo implementa.
export interface IBloque {
    estaLibre(): boolean;
    esDe(pid: string): boolean;
    esVacio(): boolean;
    entra(proceso: Proceso): boolean;
    capacidad(): number;
    kbLibres(): number;
    kbOcupados(): number;
    ocuparCon(proceso: Proceso): IBloque[];
    liberar(): void;
    puedeFusionarCon(otro: IBloque): boolean;
    fusionarCon(otro: IBloque): void;
    describir(): string;

}