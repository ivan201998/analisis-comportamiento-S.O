import { IBloque } from './IBloque';
import { Proceso } from './Proceso';

// Teoría (Temas 9 y 10): en la asignación contigua la RAM es una sucesión de bloques, cada uno
// libre (hueco) u ocupado por un proceso. Esta clase es UN bloque.
//
// PRINCIPIOS QUE APLICA
// [SOLID · S] solo sabe de SU pedazo de memoria (dónde empieza, cuánto mide, quién lo ocupa).
//     La lista completa y las políticas las manejan otras clases.
// [POO · Encapsulamiento] inicio, tamano y ocupante son privados; se usan métodos.
// [SOLID · I] implementa IBloque, el contrato público de un bloque.

export class BloqueMemoria  implements IBloque{

    // ENCAPSULAMIENTO: los 3 campos son privados. Se leen y se escriben solo a traves de
    // los get/set protegidos y de los metodos publicos (ocuparCon, liberar, fusionarCon...),
    // nunca accediendo al campo directo desde otra clase.
    private inicio: number;
    private tamano: number;
    private ocupante: string | undefined;

    constructor (inicio: number, tamano: number) {
        this.inicio = inicio;
        this.tamano = tamano;
        this.ocupante = undefined;

    }

    protected getInicio(): number {
        return this.inicio;
    }

    protected getTamano(): number{
        return this.tamano;
    }

    protected setTamano(valor: number): void{
        this.tamano = valor;
    }

    protected getOcupante(): string | undefined {
        return this.ocupante;
    }

    protected setOcupante(pid: string | undefined): void {
        this.ocupante = pid;
    }
    // Un bloque está libre (es un «hueco») si no tiene ocupante.
    estaLibre(): boolean {
        return this.getOcupante() === undefined;
    }

    esDe(pid: string): boolean {
        return this.getOcupante() === pid;
    }

    esVacio(): boolean {
        return this.getTamano() === 0;
    }
    // Asignación contigua (Tema 10): el proceso entra si el bloque está libre y alcanza.
    entra(proceso: Proceso): boolean {
        return this.estaLibre() && this.getTamano() >= proceso.tamanoMemoria;
    }

    capacidad(): number {
        return this.getTamano();
    }
    // Aporta a «memoria libre total»: sus KB si está libre, 0 si está ocupado.
    kbLibres(): number{
        return this.getTamano() * Number(this.estaLibre());
    }

    kbOcupados(): number{
        return this.capacidad() - this.kbLibres();
    }

    // Splitting: el bloque se achica al tamaño del proceso, se marca ocupado y devuelve el sobrante
    // como un bloque libre nuevo (una lista de 0 o 1 elementos: si entra justo, no hay sobrante).
    ocuparCon(proceso: Proceso): BloqueMemoria [] {
        const sobrante = new BloqueMemoria (
            this.getInicio() + proceso.tamanoMemoria,
            this.getTamano() - proceso.tamanoMemoria
        );

        this.setTamano(proceso.tamanoMemoria);
        this.setOcupante(proceso.pid);

        return [sobrante].filter(bloque => !bloque.esVacio());
    }

    liberar(): void {
        this.setOcupante(undefined);
    }
    // Coalescencia (Tema 15): dos bloques se fusionan solo si los dos están libres.
    puedeFusionarCon(otro: BloqueMemoria): boolean {
        return this.estaLibre() && otro.estaLibre();
    }
    // Suma el tamaño del vecino: el hueco crece.
    fusionarCon(otro: BloqueMemoria): void {
        this.setTamano(this.getTamano() + otro.capacidad());
    }

    // Texto para el mapa de memoria: [inicio-fin KB] dueño (o LIBRE).
    describir(): string {
        return `[${this.getInicio()}-${this.getInicio() + this.getTamano()} KB] ${this.getOcupante() ?? "LIBRE"}`;

    }
}