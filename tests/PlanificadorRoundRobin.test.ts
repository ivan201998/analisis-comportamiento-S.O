import { describe, it, expect } from 'vitest';
import { PlanificadorRoundRobin } from '../src/PlanificadorRoundRobin';
import { Estado, Proceso } from '../src/Proceso';

describe("Planificador RoundRobin", ()=>{
    it("empieza libre, sin nadie en la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);

        expect(planificador.estaLibre()).toBe(true);
        expect(planificador.procesoEnCpu()).toBeUndefined();
    })

    it("tomarControl deja al proceso EJECUTANDO y ocupa la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 4);

        planificador.tomarControl(p);

        expect(planificador.estaLibre()).toBe(false);
        expect(planificador.procesoEnCpu()).toBe("P1");
        expect(p.estaEn(Estado.EJECUTANDO)).toBe(true);
    })


    it("sin nadie en la CPU, ejecutarCpu no hace nada",()=>{
        const planificador = new PlanificadorRoundRobin(2);

        const resultado = planificador.ejecutarCpu(false);

        expect(resultado).toEqual({ ocupado: false, terminado: undefined, rotado: undefined });
    })

    it("un proceso de 1 tick termina en el primer ejecutarCpu",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 1);
        planificador.tomarControl(p);

        const resultado = planificador.ejecutarCpu(false);

        expect(resultado.terminado).toBe(p);
        expect(planificador.estaLibre()).toBe(true);
    })

    it("RF07: la finalizacion tiene prioridad sobre el vencimiento del quantum",()=>{
         // quantum 1, proceso de 1 tick: en el mismo tick se agotan las 2 cosas a la vez;
        // el resultado tiene que ser 'terminado', nunca 'rotado'.
        const planificador = new PlanificadorRoundRobin(1);
        const p = new Proceso("P1", 100, 1);
        planificador.tomarControl(p);

        const resultado = planificador.ejecutarCpu(true);

        expect(resultado.terminado).toBe(p);
        expect(resultado.rotado).toBeUndefined();
    })

     it("si se agota el quantum y hay otros listos, rota",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 5);
        planificador.tomarControl(p);
        planificador.ejecutarCpu(true);

        const resultado = planificador.ejecutarCpu(true);

        expect(resultado.rotado).toBe(p);
        expect(planificador.estaLibre()).toBe(true);
    })

     it("si se agota el quantum y no hay otros listos, renueva y sigue sin rotar",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 5);
        planificador.tomarControl(p);
        planificador.ejecutarCpu(false);

        const resultado = planificador.ejecutarCpu(false);

        expect(resultado.rotado).toBeUndefined();
        expect(resultado.terminado).toBeUndefined();
        expect(planificador.estaLibre()).toBe(false);
    })

     it("liberarCpu deja la CPU libre",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        planificador.tomarControl(new Proceso("P1", 100, 5));

        planificador.liberarCpu();

        expect(planificador.estaLibre()).toBe(true);
    })

     it("procesoActivo devuelve el proceso sin sacarlo de la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 5);
        planificador.tomarControl(p);

        expect(planificador.procesoActivo()).toBe(p);
        expect(planificador.estaLibre()).toBe(false);
    })
})