import { http, HttpResponse, delay } from "msw";
import { categorias, librosPorCategoria } from "./datos";

// Permite forzar un fallo desde el frontend con ?error=404 o ?error=500
function errorSimulado(request) {
    const tipo = new URL(request.url).searchParams.get("error");

    if (tipo === "404") {
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    if (tipo === "500") {
        return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
    return null;
}

export const handlers = [
    // Lista de categorías
    http.get("/api/categorias", async ({ request }) => {
        await delay(800);

        return errorSimulado(request) ?? HttpResponse.json(categorias);
    }),

    // Libros de una categoría
    http.get("/api/categorias/:slug/libros", async ({ request, params }) => {
        await delay(1000);

        const fallo = errorSimulado(request);
        if (fallo) return fallo;

        const categoria = categorias.find((item) => item.slug === params.slug);
        if (!categoria) {
            return HttpResponse.json({ message: "Categoría no encontrada" }, { status: 404 });
        }

        return HttpResponse.json({
            categoria,
            libros: librosPorCategoria[categoria.slug] ?? [],
        });
    }),
];