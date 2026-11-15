const formatoPrecio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
});

export default function TarjetaLibro({ libro }) {
    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{libro.titulo}</h3>
            <p className="mt-1 text-slate-600">{libro.autor}</p>
            <p className="mt-3 font-bold text-emerald-700">{formatoPrecio.format(libro.precio)}</p>
        </article>
    );
}