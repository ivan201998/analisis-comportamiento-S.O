import { IMetricas } from './IMetricas';
import { Proceso } from './Proceso';

// Contrato publico del simulador. SimuladorSO lo implementa. ReporteSimulacion depende
// de esta interfaz, no de la clase concreta SimuladorSO (Dependency Inversion).
export interface ISimulador {
    
    agregarProceso(proceso: Proceso): void;
    bloquearProcesoActual(ticks?: number): void;
    avanzarTick(): void;
    usoCpu(): number;
    cambiosDeContexto(): number;
    tickActual(): number;
    procesoEnCpu(): string | undefined;
    metricasMemoria(): IMetricas;
    mapaMemoria(): string[];
    estados(): string[];
    pidsListos(): string[];
    pidsEsperandoMemoria(): string[];
    pidsTerminados(): string[];

}