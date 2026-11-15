export default function Cargando({ mensaje = "Cargando..." }) {
    return (
        <p role="status" className="flex items-center gap-3 py-6 text-slate-600">
            <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            {mensaje}
        </p>
    );
}