// Bloque de Control de Proceso (PCB). Equivale a UnidadCombate: guarda el estado privado
// con get/set protegidos; ProcesoConES (hija) cambia el comportamiento como Soldado con su escudo.
// Los 6 estados del ciclo de vida
export enum Estado{
    NUEVO = "NUEVO",
    ESPERANDO_MEMORIA = "ESPERANDO_MEMORIA",
    LISTO = "LISTO",
    EJECUTANDO = "EJECUTANDO",
    BLOQUEADO = "BLOQUEADO",
    TERMINADO = "TERMINADO",

}

export class Proceso {
    private tiempoTotal: number;
    private tiempoRestante: number;
    private quantumConsumido: number;
    private estado: Estado;

    // pid y tamanoMemoria son la identidad del proceso: no deben poder reasignarse desde afuera
    // (RF02 / doble encapsulamiento). readonly evita esa mutacion externa.
    constructor (readonly pid: string, readonly tamanoMemoria: number, tiempoCpu: number){
        this.tiempoTotal = tiempoCpu;
        this.tiempoRestante = tiempoCpu;
        this.quantumConsumido = 0;
        this.estado = Estado.NUEVO;
        
    }
}