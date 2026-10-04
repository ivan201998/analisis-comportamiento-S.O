import { describe, it, expect } from 'vitest';
import { ReporteSimulacion } from '../../src/demo-so/ReporteSimulacion';
import { SimuladorSO } from '../../src/SimuladorSO';
import { Proceso } from '../../src/Proceso';

// ReporteSimulacion = el «tablero» del simulador (Tema 16): muestra, tick por tick, la CPU, las
// colas, el mapa de memoria y las métricas del documento de la cátedra.
// Principios que se prueban: la clase solo CONSULTA al simulador a través de ISimulador
// (SOLID · D) y solo arma texto, sin imprimir (SOLID · S).
//
// Lote de la consigna: P1(200 KB, 4 ticks) P2(350, 3) P3(150, 2) P4(400, 3). Quantum 2, First-Fit.
function simuladorEnElTick(tick: number): SimuladorSO {
    const simulador = new SimuladorSO(2);
    [
        new Proceso("P1", 200, 4),
        new Proceso("P2", 350, 3),
        new Proceso("P3", 150, 2),
        new Proceso("P4", 400, 3),
    ].forEach(p => simulador.agregarProceso(p));
    Array.from({ length: tick }).forEach(() => simulador.avanzarTick());
    return simulador;
}

// ---------------------------------------------------------------------------
// Traza del lote, un tick por vez. Los números son los de la tabla del documento de la cátedra.
// Cada columna: tick, memoria ocupada (KB), libre total (KB), mayor hueco (KB), cambios de
// contexto acumulados y cola de listos.
//   - tick 2 y 4: P1 y P2 agotan el quantum con otros esperando (cambios de contexto 1 y 2)
//   - tick 6: termina P3 y la memoria se une en un hueco de 474 KB
//   - tick 7: P4 entra a la RAM (el paso A corre antes que la CPU)
//   - tick 8 y 9: fragmentación 27,01 % y 11,86 % (huecos separados / coalescencia)
//   - tick 12: terminaron todos y la memoria queda libre
// ---------------------------------------------------------------------------
describe("Traza del lote de la consigna, un tick por vez (Tema 16)", () => {
    it.each([
        [1, 700, 324, 324, 0, "P2,P3"],
        [2, 700, 324, 324, 1, "P2,P3,P1"],
        [3, 700, 324, 324, 1, "P3,P1"],
        [4, 700, 324, 324, 2, "P3,P1,P2"],
        [5, 700, 324, 324, 2, "P1,P2"],
        [6, 550, 474, 474, 2, "P1,P2"],
        [7, 950, 74, 74, 2, "P2,P4"],
        [8, 750, 274, 200, 2, "P2,P4"],
        [9, 400, 624, 550, 2, "P4"],
        [10, 400, 624, 550, 2, ""],
        [11, 400, 624, 550, 2, ""],
        [12, 0, 1024, 1024, 2, ""],
    ])("tick %i: ocupada %i KB, libre %i KB, mayor hueco %i KB, %i cambios de contexto, listos [%s]",
        (tick, ocupada, libre, hueco, cambios, listos) => {
            const simulador = simuladorEnElTick(tick);

            console.log(new ReporteSimulacion(simulador).reporte());   // solo para capturas de Sistemas Operativos

            const m = simulador.metricasMemoria();
            expect(m.ocupada).toBe(ocupada);
            expect(m.libreTotal).toBe(libre);
            expect(m.mayorHueco).toBe(hueco);
            expect(simulador.cambiosDeContexto()).toBe(cambios);
            expect(simulador.pidsListos().join(",")).toBe(listos);
        });
});

// ---------------------------------------------------------------------------
// El texto del reporte (lo que se ve en pantalla)
// ---------------------------------------------------------------------------
describe("Texto del reporte", () => {

    // El reporte incluye el tick, las métricas y el mapa de memoria del momento.
    it("el reporte del tick 8 muestra la fragmentacion de 27.01% y el mapa de memoria", () => {
        const texto = new ReporteSimulacion(simuladorEnElTick(8)).reporte();

        expect(texto).toContain("--- TICK 8 ---");
        expect(texto).toContain("fragmentacion externa 27.01%");
        expect(texto).toContain("[0-200 KB] LIBRE");
    });

    // «CPU al cerrar el tick»: en el tick 1 queda P1 ejecutando; en el tick 2 recién salió (rotó),
    // por eso figura libre aunque el uso de CPU sigue en 100 %.
    it("informa quien queda en la CPU al cerrar el tick", () => {
        expect(new ReporteSimulacion(simuladorEnElTick(1)).reporte()).toContain("CPU al cerrar el tick: P1");
        expect(new ReporteSimulacion(simuladorEnElTick(2)).reporte()).toContain("CPU al cerrar el tick: libre");
    });
});