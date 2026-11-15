// Botones para comprobar cómo responde la interfaz ante fallos del servicio.

const estiloBoton =
    "cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60";

export default function PanelPruebas({ cargando, onRecargar }) {
    return (
        <div className="my-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-100 p-3">
            <span className="text-sm text-slate-600">Pruebas del servicio:</span>

            <button type="button" className={estiloBoton} disabled={cargando} onClick={() => onRecargar()}>
                Actualizar libros
            </button>
            <button type="button" className={estiloBoton} disabled={cargando} onClick={() => onRecargar("404")}>
                Simular error 404
            </button>
            <button type="button" className={estiloBoton} disabled={cargando} onClick={() => onRecargar("500")}>
                Simular error 500
            </button>
        </div>
    );
}