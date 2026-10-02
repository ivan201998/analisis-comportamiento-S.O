import { BloqueMemoria } from './BloqueMemoria';
import { IEstrategiaAsignacion } from './IEstrategiaAsignacion';
import { Proceso } from './Proceso';

// RF04: el primer bloque libre, recorriendo la lista en orden de direccion, que alcanza.
export class FirstFit implements IEstrategiaAsignacion {

    elegirBloque(bloques: BloqueMemoria[], proceso: Proceso): BloqueMemoria | undefined {

        return bloques.find(bloque => bloque.entra(proceso));

    }
}