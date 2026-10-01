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

    })

    it("recuerda que proceso lo ocupa", ()=>{
        
    })

    it("al ocuparse con un proceso mas chico se parte y devuelve el sobrante libre", ()=>{
        
    })

    it("si el proceso ocupa todo el bloque no queda sobrante", ()=>{
        
    })
})