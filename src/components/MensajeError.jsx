import { Link } from "react-router";

export default function MensajeError({ mensaje, onReintentar, mostrarVolver = true }) {
    return (
        <div role="alert" className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
            <p className="font-semibold">No pudimos cargar la información</p>
            <p className="mt-1">{mensaje}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={onReintentar}
                    className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                >
                    Reintentar
                </button>

                {mostrarVolver && (
                    <Link to="/" className="text-sm font-medium underline">
                        Volver a las categorías
                    </Link>
                )}
            </div>
        </div>
    );
}