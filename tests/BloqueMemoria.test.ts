import { describe, it, expect } from 'vitest';
import { BloqueMemoria } from '../src/BloqueMemoria';
import { Proceso } from '../src/Proceso';

describe("BloqueMemoria", ()=>{
    it("un bloque nuevo esta libre", ()=>{
        expect(new BloqueMemoria(0, 100).estaLibre()).toBe(true);
    })

    it("acepta un proceso que cabe", ()=>{
        const bloque = new BloqueMemoria(0, 100);

        expect(bloque.entra(new Proceso("P1", 100, 1))).toBe(true);
    })

    it("no acepta un proceso mas grande que el bloque", ()=>{
        const bloque = new BloqueMemoria(0, 100);

        expect(bloque.entra(new Proceso("P1", 101, 1))).toBe(false);
    })

    it("ocupado deja de estar libre y ya no acepta procesos", ()=>{
        const bloque = new BloqueMemoria(0, 100);
        bloque.ocuparCon(new Proceso("P1", 40, 1));

        expect(bloque.estaLibre()).toBe(false);
        expect(bloque.entra(new Proceso("P2", 10, 1))).toBe(false);
    })

    it("recuerda que proceso lo ocupa", ()=>{
        const bloque = new BloqueMemoria(0, 100);
        bloque.ocuparCon(new Proceso("P1", 40, 1));

        expect(bloque.esDe("P1")).toBe(true);
        expect(bloque.esDe("P2")).toBe(false);
    })

    it("al ocuparse con un proceso mas chico se parte y devuelve el sobrante libre", ()=>{
        const bloque = new BloqueMemoria(0, 100);

        const sobrante = bloque.ocuparCon(new Proceso("P1", 40, 1));

        expect(bloque.capacidad()).toBe(40);
        expect(sobrante).toHaveLength(1);
        expect(sobrante[0].describir()).toBe("[40-100 KB] LIBRE");
    })

    it("si el proceso ocupa todo el bloque no queda sobrante", ()=>{
        const bloque = new BloqueMemoria(0, 100);

        const sobrante = bloque.ocuparCon(new Proceso("P1", 100, 1));

        expect(sobrante).toHaveLength(0);
        expect(bloque.capacidad()).toBe(100);
    })

    it("liberar lo deja libre otra vez", ()=>{

    })

    it("cuenta sus KB como libres u ocupados segun su estado", ()=>{
        
    })

    it("dos bloques libres pueden fusionarse y suman su tamano", ()=>{
        
    })

    it("un bloque ocupado no puede fusionarse", ()=>{
        
    })

    it("se describe con su rango y su ocupante", ()=>{
        
    })
})