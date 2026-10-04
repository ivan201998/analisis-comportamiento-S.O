import { IReporte } from './IReporte';
import { ISimulador } from '../ISimulador';

// Teoría (Tema 16): un simulador educativo debe mostrar, en cada tick, el reloj, el proceso en
// CPU, las colas, el mapa de memoria y las métricas, para poder explicar cada decisión.
//
// PRINCIPIOS QUE APLICA
// [SOLID · S] solo ARMA el texto del reporte. No calcula nada (lo consulta) y no imprime:
//     mostrarlo por pantalla es responsabilidad de quien la use (la demo o un test).
// [SOLID · D] depende de ISimulador (la interfaz), no de SimuladorSO (la clase concreta).
// [POO · Encapsulamiento] solo usa los métodos de consulta del simulador (RF10): nunca toca
//     los objetos internos.
// [SOLID · I] implementa IReporte.
export class ReporteSimulacion implements IReporte {

    constructor(private simulador: ISimulador) {}

    // Arma el reporte del tick actual: CPU, métricas de memoria, colas, estados y mapa de RAM.
    // "CPU al cerrar el tick" = quién queda en la CPU cuando termina el tick: si un proceso acaba
    // de salir (terminó o rotó), dice "libre", aunque durante el tick la CPU sí trabajó.
    reporte(): string {
        const m = this.simulador.metricasMemoria();
        const enCpu = this.simulador.procesoEnCpu();

        return [
            `--- TICK ${this.simulador.tickActual()} ---`,
            `CPU al cerrar el tick: ${enCpu === undefined ? "libre" : enCpu} | uso ${this.simulador.usoCpu().toFixed(2)}% | cambios de contexto ${this.simulador.cambiosDeContexto()}`,
            `Memoria: ocupada ${m.ocupada} KB | libre ${m.libreTotal} KB | mayor hueco ${m.mayorHueco} KB | fragmentacion externa ${m.fragmentacionExterna.toFixed(2)}%`,
            `Listos [${this.simulador.pidsListos()}] | Esperando memoria [${this.simulador.pidsEsperandoMemoria()}] | Terminados [${this.simulador.pidsTerminados()}]`,
            `Estados: ${this.simulador.estados().join(" | ")}`,
            ...this.simulador.mapaMemoria().map(linea => "   " + linea),
        ].join("\n");
    }
}