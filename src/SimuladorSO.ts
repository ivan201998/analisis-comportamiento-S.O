import { AdministradorMemoria } from './AdministradorMemoria';
import { IColas } from './IColas';
import { ColasProcesos } from './ColasProcesos';
import { IEstadisticas } from './IEstadisticas';
import { EstadisticasCpu } from './EstadisticasCpu';
import { IEstrategiaAsignacion } from './IEstrategiaAsignacion';
import { FirstFit } from './FirstFit';
import { IGestorMemoria } from './IGestorMemoria';
import { IMetricas } from './IMetricas';
import { IPlanificador } from './IPlanificador';
import { PlanificadorRoundRobin } from './PlanificadorRoundRobin';
import { Proceso } from './Proceso';
import { IResultadoTick } from './IResultadoTick';
import { ISimulador } from './ISimulador';

// El coordinador: cada tick repite siempre los mismos pasos, en orden.
// COMPOSICION ("tiene un"): esta clase tiene un IGestorMemoria, una IColas, un
// IPlanificador y una IEstadisticas. No es ninguna de esas cosas: las orquesta.
// Ya NO junta la logica de Round-Robin ni de las colas (antes estaban aca fusionadas por
// el limite de 5 clases); ahora cada una vive en su propia clase, asi que se resolvio el
// problema de SOLID-S que estaba anotado antes.
// SOLID (ya no falta la D): los 4 campos de abajo son de tipo INTERFAZ (IGestorMemoria,
// IColas, IPlanificador, IEstadisticas), no de la clase concreta. Esta clase depende de
// abstracciones, no de implementaciones, en los 4 colaboradores.

export class SimuladorSO implements ISimulador {

    private memoria: IGestorMemoria;
    private colas: IColas = new ColasProcesos();
    private planificador: IPlanificador;
    private estadisticas: IEstadisticas = new EstadisticasCpu();
    private todos: Proceso[] = [];

    constructor(quantum: number = 2, tamanoMemoria: number = 1024, estrategia: IEstrategiaAsignacion = new FirstFit()){

        this.planificador = new PlanificadorRoundRobin(SimuladorSO.enteroPositivo(quantum, "El quantum"));
        this.memoria = new AdministradorMemoria(tamanoMemoria, estrategia);

    }

    // RF01: rechaza configuraciones invalidas antes de crear ningun estado (sin estados parciales).
    private static enteroPositivo(valor: number, nombre: string): number {

        const esValido = Number.isInteger(valor) && valor > 0;
        return esValido ? valor : SimuladorSO.error(`${nombre} debe ser un entero positivo`);

        
    }
}
