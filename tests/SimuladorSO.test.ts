import { describe, it, expect } from 'vitest';
import { SimuladorSO } from '../src/SimuladorSO';
import { Proceso } from '../src/Proceso';
import { ProcesoConES } from '../src/ProcesoConES';

// Lote de la consigna: PID, KB, ticks de CPU. First-Fit, quantum 2.
function simuladorDeLaConsigna(): SimuladorSO {
    const simulador = new SimuladorSO(2);
    simulador.agregarProceso(new Proceso("P1", 200, 4));
    simulador.agregarProceso(new Proceso("P2", 350, 3));
    simulador.agregarProceso(new Proceso("P3", 150, 2));
    simulador.agregarProceso(new Proceso("P4", 400, 3));
    return simulador;

}

function avanzar(simulador: SimuladorSO, ticks: number): void {
    Array.from({ length: ticks }).forEach(() => simulador.avanzarTick());
}

describe("SimuladorSO", ()=>{
    it("tick 1: P1, P2 y P3 entran a RAM, P4 no cabe y espera memoria", ()=>{
        const simulador = simuladorDeLaConsigna();

        avanzar(simulador, 1);

        expect(simulador.pidsEsperandoMemoria()).toEqual(["P4"]);
        expect(simulador.pidsListos()).toEqual(["P2", "P3"]);   // P1 ya esta en la CPU
        expect(simulador.mapaMemoria()).toEqual([
            "[0-200 KB] P1", "[200-550 KB] P2", "[550-700 KB] P3", "[700-1024 KB] LIBRE"
        ]);
    })

    it("tick 2: P1 agota el quantum y vuelve al final de listos", ()=>{
        const simulador = simuladorDeLaConsigna();

        avanzar(simulador, 2);

        expect(simulador.pidsListos()).toEqual(["P2", "P3", "P1"]);
        expect(simulador.cambiosDeContexto()).toBe(1);
    })

    it("tick 6: P3 termina, libera y coalesce; queda un unico hueco de 474 KB (0% fragmentacion)", ()=>{
        const simulador = simuladorDeLaConsigna();

        avanzar(simulador, 6);

        expect(simulador.mapaMemoria()).toEqual(["[0-200 KB] P1", "[200-550 KB] P2", "[550-1024 KB] LIBRE"]);
        expect(simulador.metricasMemoria().libreTotal).toBe(474);
        expect(simulador.metricasMemoria().fragmentacionExterna).toBe(0);
    })

    it("tick 7: con la memoria liberada, P4 por fin obtiene RAM", ()=>{
        const simulador = simuladorDeLaConsigna();

        avanzar(simulador, 7);

        expect(simulador.pidsEsperandoMemoria()).toEqual([]);
        expect(simulador.mapaMemoria()).toContain("[550-950 KB] P4");
    })

    it("tras 12 ticks todos terminaron, CPU 100% y 2 cambios de contexto", ()=>{

    })

    it("RF09: en el tick 0, antes de avanzar, el uso de CPU es 0%", ()=>{
        
    })

    it("la CPU ociosa baja el uso de CPU", ()=>{
        
    })

    it("un proceso con E/S bloqueado vuelve a listos cuando termina su espera", ()=>{
        
    })

    it("un proceso sin E/S ignora el pedido de bloqueo", ()=>{
        
    })
})