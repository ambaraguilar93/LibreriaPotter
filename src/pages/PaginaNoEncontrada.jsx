import { Link } from "react-router";

export default function PaginaNoEncontrada() {
    return (
        <section>
            <h1 className="text-3xl font-bold text-slate-900">Página no encontrada</h1>
            <p className="mt-1 text-slate-600">La dirección que ingresaste no existe en la tienda.</p>
            <Link to="/" className="mt-4 inline-block font-medium text-emerald-700 underline">
                Volver al inicio
            </Link>
        </section>
    );
}