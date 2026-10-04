import { Proceso } from './Proceso';

// Resultado de ejecutar 1 tick de CPU: le informa a SimuladorSO qué pasó (¿hubo CPU ocupada?,
// ¿quién terminó?, ¿quién rotó?) para que reaccione. Así el planificador no toca colas ni memoria
// ([SOLID · S]).
export interface IResultadoTick {
    ocupado: boolean;
    terminado?: Proceso;
    rotado?: Proceso;
}