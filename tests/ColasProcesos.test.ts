import { describe, it, expect } from 'vitest';
//import { ColasProcesos } from '../src/ColasProcesos';
import { Estado, Proceso } from '../src/Proceso';
//import { ProcesoConES } from '../src/ProcesoConES';

describe ("Colas Procesos", ()=>{
    it("un proceso recien agregado queda en NUEVO",()=>{
        const colas = new ColasProcesos();
        const p = new Proceso("P1", 100, 1);

        colas.agregarNuevo(p);

        expect(p.estaEn(Estado.NUEVO)).toBe(true);
    })

    it("ingresarNuevos pasa a ESPERANDO_MEMORIA y vacia la cola de nuevos",()=>{
        const colas = new colasProcesos();
        const p = new Proceso("P1", 100, 1);
        colas.agregarNuevo(p);

        expect(p.estaEn(Estado.ESPERANDO_MEMORIA)).toBe(true);
        expect(colas.pidsEsperandoMemoria()).toEqual(["P1"]);
    })

})