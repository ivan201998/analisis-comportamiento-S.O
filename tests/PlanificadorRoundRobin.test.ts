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

    })

     it("si se agota el quantum y hay otros listos, rota",()=>{
        
    })

     it("si se agota el quantum y no hay otros listos, renueva y sigue sin rotar",()=>{
        
    })

     it("liberarCpu deja la CPU libre",()=>{
        
    })

     it("procesoActivo devuelve el proceso sin sacarlo de la CPU",()=>{
        
    })
})