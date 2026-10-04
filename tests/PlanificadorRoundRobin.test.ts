import { describe, it, expect } from 'vitest';
import { PlanificadorRoundRobin } from '../src/PlanificadorRoundRobin';
import { Estado, Proceso } from '../src/Proceso';

// PlanificadorRoundRobin = quién usa la CPU y por cuánto tiempo (Temas 5, 6, 7 y 8).
// Teoría: Round-Robin es apropiativo: cada proceso usa la CPU como máximo un quantum y, si no
// terminó, vuelve al final de la cola. Con un solo procesador, solo uno está en la CPU a la vez.
// Principios: SRP (solo maneja CPU y quantum, no toca memoria ni colas: por eso DEVUELVE un
// IResultadoTick y deja que SimuladorSO reaccione) y encapsulamiento (enCpu es privado).
// SOLID · O/D: otro algoritmo (por ejemplo FCFS) sería otra clase que cumpla IPlanificador.

// ---------------------------------------------------------------------------
// Teoría: el dispatcher entrega la CPU al proceso elegido y lo pasa a EJECUTANDO.
// ---------------------------------------------------------------------------

describe("La CPU: libre u ocupada (dispatcher, Tema 5)", () => {
    // Al iniciar, la CPU no tiene a nadie.
    it("empieza libre, sin nadie en la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);

        expect(planificador.estaLibre()).toBe(true);
        expect(planificador.procesoEnCpu()).toBeUndefined();
    })

    // Al recibir la CPU, el proceso pasa a EJECUTANDO y la CPU queda ocupada.
    it("tomarControl deja al proceso EJECUTANDO y ocupa la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 4);

        planificador.tomarControl(p);

        expect(planificador.estaLibre()).toBe(false);
        expect(planificador.procesoEnCpu()).toBe("P1");
        expect(p.estaEn(Estado.EJECUTANDO)).toBe(true);
    })

    // Se usa, por ejemplo, cuando el proceso se bloquea por E/S.
     it("liberarCpu deja la CPU libre",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        planificador.tomarControl(new Proceso("P1", 100, 5));

        planificador.liberarCpu();

        expect(planificador.estaLibre()).toBe(true);
    })

    // Permite «mirar» quién está en la CPU sin sacarlo.
     it("procesoActivo devuelve el proceso sin sacarlo de la CPU",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 5);
        planificador.tomarControl(p);

        expect(planificador.procesoActivo()).toBe(p);
        expect(planificador.estaLibre()).toBe(false);
    })
})

// ---------------------------------------------------------------------------
// Teoría: cada tick le descuenta una unidad al proceso que está en la CPU.
// ---------------------------------------------------------------------------
describe("Un tick de CPU (Tema 7)", () => {
    // CPU ociosa: no hay nada que ejecutar y se informa «ocupado: false».
    it("sin nadie en la CPU, ejecutarCpu no hace nada",()=>{
        const planificador = new PlanificadorRoundRobin(2);

        const resultado = planificador.ejecutarCpu(false);

        expect(resultado).toEqual({ ocupado: false, terminado: undefined, rotado: undefined });
    })

    // Si no le queda CPU, el proceso termina y la CPU queda libre.
    it("un proceso de 1 tick termina en el primer ejecutarCpu",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 1);
        planificador.tomarControl(p);

        const resultado = planificador.ejecutarCpu(false);

        expect(resultado.terminado).toBe(p);
        expect(planificador.estaLibre()).toBe(true);
    })
})

// ---------------------------------------------------------------------------
// Teoría: cuando el proceso agota su quantum hay dos caminos. Si hay otros listos, sale de la
// CPU y vuelve al final de la cola (rota, y cuenta un cambio de contexto). Si no hay nadie más,
// renueva su quantum y sigue, porque cambiar a «nadie» no tendría sentido.
// ---------------------------------------------------------------------------
describe("Quantum: rotar, renovar y prioridad de la finalización (Temas 7 y 8)", () =>{
    // Quantum 2: después del segundo tick agota su turno y, como hay otros listos, ROTA.
     it("si se agota el quantum y hay otros listos, rota",()=>{
        const planificador = new PlanificadorRoundRobin(2);
        const p = new Proceso("P1", 100, 5);
        planificador.tomarControl(p);
        planificador.ejecutarCpu(true);

        const resultado = planificador.ejecutarCpu(true);

        expect(resultado.rotado).toBe(p);
        expect(planificador.estaLibre()).toBe(true);
    })

    // Agota el quantum pero está solo: renueva y sigue en la CPU, sin rotar y sin cambio de contexto.
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

    // Caso límite: termina justo cuando agota el quantum. Se lo trata como TERMINADO, nunca como rotado.
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
})