import { Colas } from './Colas';
import { Estado, Proceso } from './Proceso';

// Las 3 salas de espera del proceso (esperando memoria, listos, bloqueados) mas los dos
// extremos del ciclo de vida (nuevos y terminados). RESPONSABILIDAD UNICA: esta clase solo
// mueve procesos de una cola a otra; no sabe nada de memoria ni de CPU.

export class ColasProcesos implements Colas {
    // ENCAPSULAMIENTO: las 5 listas son privadas. Nadie de afuera empuja o saca procesos
    // directo; todo pasa por los metodos de abajo.

    private nuevos: Proceso [] = [];
    private esperaMemoria: Proceso[] = [];
    private listo: Proceso[] = [];
    private bloqueados: Proceso[] = [];
    private terminados: Proceso[] = [];

    agregarNuevo(proceso: Proceso): void{

        proceso.cambiarEstado(Estado.NUEVO);
        this.nuevos.push(proceso);
    }

    ingresarNuevos(): void{

        this.nuevos.forEach(proceso => proceso.cambiarEstado(Estado.ESPERANDO_MEMORIA));
        this.esperaMemoria.push(...this.nuevos);
        this.nuevos = [];

    }

    // RF03: reintenta la asignacion en orden de registro. Recibe COMO PARAMETRO la funcion
    // que intenta asignar memoria (se la pasa SimuladorSO), asi esta clase no necesita
    // conocer a AdministradorMemoria (bajo acoplamiento).

    reintentarMemoria(intentarAsignar: (proceso: Proceso) => boolean): void {
        const ubicados = this.esperaMemoria.filter(intentarAsignar);

        this.esperaMemoria = this.esperaMemoria.filter(proceso => !ubicados.includes(proceso));

        ubicados.forEach(proceso => proceso.cambiarEstado(Estado.LISTO));

        this.listo.push(...ubicados);
    }

    
}