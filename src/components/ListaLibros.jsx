import { useCallback } from "react";
import { useConsulta } from "../hooks/useConsulta";
import { obtenerLibrosPorCategoria } from "../services/libreriaService";
import Cargando from "./Cargando";
import MensajeError from "./MensajeError";
import PanelPruebas from "./PanelPruebas";
import TarjetaLibro from "./TarjetaLibro";

export default function ListaLibros({ slug }) {
    // useCallback mantiene la misma función mientras no cambie la categoría
    const consultarLibros = useCallback(({ signal }) => obtenerLibrosPorCategoria(slug, { signal }), [slug]);
    const { datos, cargando, error, recargar } = useConsulta(`libros:${slug}`, consultarLibros);

    const libros = datos?.libros ?? [];

    return (
        <section>
            <h1 className="text-3xl font-bold text-slate-900">{datos?.categoria.nombre ?? "Categoría"}</h1>
            {datos && <p className="mt-1 text-slate-600">{datos.categoria.descripcion}</p>}

            <PanelPruebas
                ruta="/api/categorias/:slug/libros"
                cargando={cargando}
                onRecargar={recargar}
                etiquetaActualizar="Actualizar libros"
            />

            {cargando && <Cargando mensaje="Cargando libros..." />}

            {error && <MensajeError mensaje={error} onReintentar={() => recargar()} />}

            {!cargando && error && libros.length > 0 && (
                <p className="mb-4 text-slate-600">Mientras tanto, puedes revisar los últimos libros cargados.</p>
            )}

            {!cargando && !error && datos && libros.length === 0 && (
                <p className="py-6 text-slate-600">Por ahora no hay libros disponibles en esta categoría.</p>
            )}

            {!cargando && libros.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {libros.map((libro) => (
                        <TarjetaLibro key={libro.id} libro={libro} />
                    ))}
                </div>
            )}
        </section>
    );
}