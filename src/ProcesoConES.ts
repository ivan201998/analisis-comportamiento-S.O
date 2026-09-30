import { Proceso } from "./Proceso";

// Proceso que ademas puede bloquearse por E/S durante N ticks.
export class ProcesoConES extends Proceso{
    
    private tiempoBloqueo: number = 0;

    
}