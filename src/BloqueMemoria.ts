import { IBloque } from './IBloque';
import { Proceso } from './Proceso';

// Una particion contigua de la RAM, libre u ocupada.
export class BloqueoMemoria implements IBloque{

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
}