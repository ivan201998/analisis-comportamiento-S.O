import { describe, it, expect } from 'vitest';
import { Proceso } from '../src/Proceso';
import { ProcesoConES } from '../src/ProcesoConES';

describe("Proceso de CPU", ()=>{
    it("un proceso de 1 tick de CPU termina despues de ejecutar 1 tick", ()=>{
        const proceso = new Proceso("P1", 200, 1);

        expect(proceso.estaTerminado()).toBe(false);
        proceso.ejecutarTick();
        expect(proceso.estaTerminado()).toBe(true);
    })
    
    it("un proceso de 2 ticks de CPU necesita 2 ticks para terminar", ()=>{
        const proceso = new Proceso("P1", 200, 2);

        proceso.ejecutarTick();
        expect(proceso.estaTerminado()).toBe(false);

        proceso.ejecutarTick();
        expect(proceso.estaTerminado()).toBe(true);
    })

    it("agota el quantum cuando consume tantos ticks como el limite", ()=>{
        const proceso = new Proceso("P1", 200, 5);

        proceso.ejecutarTick();
        expect(proceso.agotoQuantum(2)).toBe(false);

        proceso.ejecutarTick();
        expect(proceso.agotoQuantum(2)).toBe(true);
    })

    it("reiniciar el quantum vuelve a dejarlo sin consumir", ()=>{
        const proceso = new Proceso("P1", 200, 5);

        proceso.ejecutarTick();
        proceso.ejecutarTick();
        proceso.reiniciarQuantum();

        expect(proceso.agotoQuantum(2)).toBe(false);
    })

    it("un proceso solo CPU no admite E/S ni se bloquea", ()=>{
        const proceso = new Proceso("P1", 200, 5);

        proceso.bloquear(3);

        expect(proceso.admiteES()).toBe(false);
        expect(proceso.estaBloqueado()).toBe(false);

    })

    describe("Proceso con E/S", ()=>{
        it("admite E/S",()=>{
            expect(new ProcesoConES("P1", 100, 5).admiteES()).toBe(true);
        })

        it("no esta bloqueado al crearse",()=>{
            expect(new ProcesoConES("P1", 100, 5).estaBloqueado()).toBe(false);
        })

        it("queda bloqueado despues de bloquear",()=>{
            const proceso = new ProcesoConES("P1", 100, 5);

            proceso.bloquear(2);

            expect(proceso.estaBloqueado()).toBe(true);
        })

    })
})