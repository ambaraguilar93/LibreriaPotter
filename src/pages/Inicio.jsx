import { Link, useOutletContext } from "react-router";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";

export default function Inicio() {
    // Usa la misma consulta de categorías que hizo el Layout (no se repite la petición)
    const { datos, cargando, error, recargar } = useOutletContext();
    const categorias = datos ?? [];

    return (
        <section>
            <h1 className="text-3xl font-bold text-slate-900">Explora nuestras categorías</h1>
            <p className="mt-1 text-slate-600">Elige una categoría para ver los libros disponibles.</p>

            {cargando && <Cargando mensaje="Cargando categorías..." />}

            {error && <MensajeError mensaje={error} onReintentar={() => recargar()} mostrarVolver={false} />}

            {!cargando && !error && categorias.length === 0 && (
                <p className="py-6 text-slate-600">Por ahora no hay categorías disponibles.</p>
            )}

            {categorias.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria.slug}
                            to={`/categoria/${categoria.slug}`}
                            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-600"
                        >
                            <h2 className="text-lg font-semibold text-emerald-800">{categoria.nombre}</h2>
                            <p className="mt-1 text-slate-600">{categoria.descripcion}</p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}