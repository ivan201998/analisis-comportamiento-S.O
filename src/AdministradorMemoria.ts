import { BloqueMemoria } from './BloqueMemoria';
import { IEstrategiaAsignacion } from './IEstrategiaAsignacion';
import { FirstFit } from './FirstFit';
import { IGestorMemoria } from './IGestorMemoria';
import { IMetricas } from './IMetricas';
import { Proceso } from './Proceso';

// La RAM completa es una lista de bloques contiguos.
// COMPOSICION ("tiene un"): esta clase tiene una lista de BloqueMemoria y una
// IEstrategiaAsignacion. No es ninguna de esas cosas, las coordina.
// RF04 / SOLID (ya no faltan la O ni la D): la politica de asignacion se recibe por
// constructor (inyeccion de dependencias). Agregar una politica nueva no requiere tocar
// esta clase (Open/Closed), y esta clase depende de la interfaz IEstrategiaAsignacion, no
// de una politica concreta (Dependency Inversion). Ademas esta clase IMPLEMENTA la
// interfaz IGestorMemoria: SimuladorSO depende de ese contrato, no de esta clase concreta.
export class AdministradorMemoria implements IGestorMemoria {

    // ENCAPSULAMIENTO: la lista de bloques es privada. Nadie de afuera puede
    // agregar/sacar/reordenar bloques directo; solo a traves de asignar() y liberar().
    private bloques: BloqueMemoria[];
    private tamanoTotal: number;
    private estrategia: IEstrategiaAsignacion;

    constructor(tamanoTotal: number = 1024, estrategia: IEstrategiaAsignacion = new FirstFit()) {

        this.tamanoTotal = AdministradorMemoria.enteroPositivo(tamanoTotal, "El tamano de memoria");
        this.bloques = [new BloqueMemoria(0, this.tamanoTotal)];
        this.estrategia = estrategia;

    }

    // RF01: rechaza configuraciones invalidas antes de crear ningun bloque (sin estados parciales).
    private static enteroPositivo(valor: number, nombre: string): number {

        const esValido = Number.isInteger(valor) && valor > 0;

        return esValido ? valor : AdministradorMemoria.error(`${nombre} debe ser un entero positivo`);

    }

    // Metodo de apoyo solo para poder "lanzar el error" desde dentro de un ternario
    // (throw no se puede usar como expresion). Nunca devuelve nada: siempre corta la ejecucion.
    private static error(mensaje: string): never {

        throw new Error(mensaje);

    }

    protected getBloques(): BloqueMemoria[] {

        return this.bloques;

    }

    protected setBloques(bloques: BloqueMemoria[]): void {

        this.bloques = bloques;

    }

    // RF04: delega en la estrategia inyectada quien elige el bloque (POLIMORFISMO: no
    // importa si es FirstFit, BestFit o WorstFit, se usa siempre igual).
    asignar(proceso: Proceso): boolean {

        const elegido = this.estrategia.elegirBloque(this.getBloques(), proceso);
        const sobrantes = new Map([[elegido, elegido?.ocuparCon(proceso) ?? []]]);

        this.setBloques(this.getBloques().flatMap(bloque => [bloque, ...(sobrantes.get(bloque) ?? [])]));

        return elegido !== undefined;

    }

}
