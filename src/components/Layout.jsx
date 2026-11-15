import { NavLink, Outlet } from "react-router";
import { useConsulta } from "../hooks/useConsulta";
import { obtenerCategorias } from "../services/libreriaService";

function estiloEnlace({ isActive }) {
    return isActive
        ? "rounded-md bg-emerald-700 px-3 py-1.5 font-semibold text-white"
        : "rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-200";
}

export default function Layout() {
    // Las categorías se consultan una sola vez aquí y se comparten con las páginas
    const consultaCategorias = useConsulta(obtenerCategorias);
    const categorias = consultaCategorias.datos ?? [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-4">
                    <p className="text-xl font-bold text-emerald-800">Librería Potter</p>

                    <nav aria-label="Navegación principal" className="mt-3 flex flex-wrap items-center gap-2">
                        <NavLink to="/" end className={estiloEnlace}>
                            Inicio
                        </NavLink>

                        {categorias.map((categoria) => (
                            <NavLink key={categoria.slug} to={`/categoria/${categoria.slug}`} className={estiloEnlace}>
                                {categoria.nombre}
                            </NavLink>
                        ))}

                        {consultaCategorias.cargando && (
                            <span role="status" className="text-sm text-slate-500">
                                Cargando categorías...
                            </span>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <Outlet context={consultaCategorias} />
            </main>
        </div>
    );
}