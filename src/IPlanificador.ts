import { Proceso } from './Proceso';
import { IResultadoTick } from './IResultadoTick';

// Contrato publico del planificador de CPU. PlanificadorRoundRobin lo implementa.
export interface IPlanificador {
    estaLibre(): boolean;
    tomarControl(proceso: Proceso): void;
    procesoEnCpu(): string | undefined;
    procesoActivo(): Proceso | undefined;
    liberarCpu(): void;
    ejecutarCpu(hayOtrosListos: boolean): IResultadoTick;
    
}