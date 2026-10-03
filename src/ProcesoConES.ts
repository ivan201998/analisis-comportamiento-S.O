import { ComportamientoProceso } from './IComportamientoProceso';
import { Proceso } from './Proceso';

// Teoría (Tema 2): un proceso puede quedar BLOQUEADO esperando una entrada/salida y, al terminar,
// vuelve a LISTO. No todos los procesos hacen E/S: este es el que sí.
//
// PRINCIPIOS QUE APLICA
// [POO · Herencia] relación «es un»: un ProcesoConES ES un Proceso, con un comportamiento extra.
// [POO · Polimorfismo] sobrescribe (override) 4 métodos de Proceso; el resto del simulador los
//     llama igual que a los de un Proceso común.
// [SOLID · L] se puede usar en cualquier lugar donde se espera un Proceso sin que nada se rompa.
// [SOLID · O] se agregó comportamiento nuevo (la E/S) SIN modificar Proceso ni SimuladorSO.
// [POO · Encapsulamiento] el tiempo de bloqueo es privado, con get/set protegidos.

export class ProcesoConES extends Proceso implements ComportamientoProceso{

    // Cuántos ticks le faltan de espera de E/S. 0 = no está esperando.
    private tiempoBloqueo: number = 0;

    protected getTiempoBloqueo(): number{

        return this.tiempoBloqueo;

    }

    protected setTiempoBloqueo(valor: number): void {

        this.tiempoBloqueo = valor;

    }

    // Sí hace E/S (el Proceso común responde false).
    override admiteES(): boolean {
        return true;
    }

    // Empieza la espera de E/S: va a esperar `ticks` ticks.
    override bloquear(ticks: number): void {

        this.setTiempoBloqueo(ticks);

    }

    // Pasa un tick de espera. mayorEntre(0, ...) evita que la espera baje de cero.
    override avanzarBloqueo(): void {

        this.setTiempoBloqueo(this.mayorEntre(0, this.getTiempoBloqueo() - 1));
    }

    // Mientras le queden ticks de espera, está bloqueado.
    override estaBloqueado(): boolean {
        return this.getTiempoBloqueo() > 0;
    }
}