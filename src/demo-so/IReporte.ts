// Contrato de un reporte: devuelve un texto con el estado de la simulación.
// [SOLID · I] interfaz chica, de un solo método. [SOLID · D] quien necesite un reporte depende
// de este contrato y no de la clase concreta.
export interface IReporte {
    reporte(): string;
}