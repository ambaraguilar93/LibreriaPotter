// Botones para comprobar cómo responde la interfaz ante fallos del servicio.
// Solo aparece cuando el backend simulado está activo.
import { USAR_MOCK } from "../config";

const estiloBoton =
    "cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60";

const BOTONES = [
    { escenario: "404", etiqueta: "Error 404" },
    { escenario: "500", etiqueta: "Error 500" },
    { escenario: "red", etiqueta: "Sin conexión" },
    { escenario: "demora", etiqueta: "Respuesta lenta" },
    { escenario: "json-invalido", etiqueta: "Datos inválidos" },
];

export default function PanelPruebas({ ruta, cargando, onRecargar, etiquetaActualizar = "Actualizar" }) {
    if (!USAR_MOCK) return null;

    async function simular(escenario) {
        // Import dinámico: el simulador no forma parte del código normal de la app
        const { simularFallo } = await import("../mocks/simulador");
        simularFallo(ruta, escenario);
        onRecargar();
    }

    return (
        <div className="my-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-100 p-3">
            <span className="text-sm text-slate-600">Pruebas del servicio:</span>

            <button type="button" className={estiloBoton} disabled={cargando} onClick={() => onRecargar()}>
                {etiquetaActualizar}
            </button>

            {BOTONES.map(({ escenario, etiqueta }) => (
                <button
                    key={escenario}
                    type="button"
                    className={estiloBoton}
                    disabled={cargando}
                    onClick={() => simular(escenario)}
                >
                    {etiqueta}
                </button>
            ))}
        </div>
    );
}