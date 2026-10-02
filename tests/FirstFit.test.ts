import { describe, it, expect } from 'vitest';
import { FirstFit } from '../src/FirstFit';
import { BloqueMemoria } from '../src/BloqueMemoria';
import { Proceso } from '../src/Proceso';

describe("FirstFit", () => {
     it("elige el primer bloque que alcanza, en orden de direccion", () => {
        const bloques = [new BloqueMemoria(0, 100), new BloqueMemoria(100, 300)];

        const elegido = new FirstFit().elegirBloque(bloques, new Proceso("P1", 50, 1));

        expect(elegido).toBe(bloques[0]);
    })

     it("salta el primero si no alcanza y elige el siguiente", () => {
        const bloques = [new BloqueMemoria(0, 20), new BloqueMemoria(20, 300)];

        const elegido = new FirstFit().elegirBloque(bloques, new Proceso("P1", 50, 1));

        expect(elegido).toBe(bloques[1]);
    })

     it("devuelve undefined si ningun bloque alcanza", () => {
        const bloques = [new BloqueMemoria(0, 10)];

        expect(new FirstFit().elegirBloque(bloques, new Proceso("P1", 50, 1))).toBeUndefined();
    })

     it("ignora los bloques ocupados", () => {
        const ocupado = new BloqueMemoria(0, 500);
        ocupado.ocuparCon(new Proceso("X", 500, 1));
        const libre = new BloqueMemoria(500, 300);

        const elegido = new FirstFit().elegirBloque([ocupado, libre], new Proceso("P1", 50, 1));

        expect(elegido).toBe(libre);
    })
})