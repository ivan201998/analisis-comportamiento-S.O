## Principios de POO

| Principio | Dónde se ve | Cómo |
|---|---|---|
| **Abstracción** | `Proceso`, `IMetricas`, `IGestorMemoria`, `IEstrategiaAsignacion` | Modelan solo lo importante: el PCB sin registros, las métricas como valores, la memoria como un contrato. |
| **Encapsulamiento** | Todas las clases | Campos `private` con get/set `protected`; las consultas devuelven PIDs o textos, nunca las listas internas. `pid` y `tamanoMemoria` usan `readonly` (inmutabilidad). |
| **Herencia** | `ProcesoConES extends Proceso` | Un proceso con E/S «es un» proceso con comportamiento extra. |
| **Polimorfismo** | `ProcesoConES` (`override`), `FirstFit` | `admiteES`, `bloquear`, `avanzarBloqueo`, `estaBloqueado` se comportan distinto según la clase; el simulador no pregunta el tipo. |
| **Composición** | `SimuladorSO`, `AdministradorMemoria` | `SimuladorSO` crea y gobierna sus colaboradoras; `AdministradorMemoria` crea y gobierna sus bloques. |
| **Agregación** | `AdministradorMemoria` y su estrategia | La estrategia llega de afuera (constructor) y existe por sí sola. |
| **Inyección de dependencias** | `SimuladorSO`, `AdministradorMemoria`, `ColasProcesos.reintentarMemoria` | La estrategia entra por el constructor; la cola recibe una función para asignar memoria. |

## Principios SOLID

| Principio | Dónde se ve | Cómo |
|---|---|---|
| **S** (responsabilidad única) | Todas | `Proceso` guarda datos; `ColasProcesos` mueve procesos; `PlanificadorRoundRobin` maneja la CPU; `AdministradorMemoria` la RAM; `EstadisticasCpu` cuenta; `SimuladorSO` coordina. |
| **O** (abierto/cerrado) | `IEstrategiaAsignacion`, `IPlanificador`, `ProcesoConES` | Agregar Best-Fit, otro planificador o procesos con E/S es sumar clases, sin modificar las existentes. |
| **L** (Liskov) | `ProcesoConES` | Se usa en cualquier lugar que espere un `Proceso` sin que nada se rompa. |
| **I** (segregación de interfaces) | Las 11 interfaces `I...` | Contratos chicos y específicos: uno por clase. |
| **D** (inversión de dependencias) | `SimuladorSO` y `AdministradorMemoria` | `SimuladorSO` depende de `IGestorMemoria`, `IColas`, `IPlanificador` e `IEstadisticas`; `AdministradorMemoria` depende de `IEstrategiaAsignacion`. |
