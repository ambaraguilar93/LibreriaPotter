import { http, HttpResponse, delay } from "msw";
import { categorias, librosPorCategoria } from "./datos";

// Comportamiento normal del backend simulado.
// Los fallos de prueba se agregan en tiempo de ejecución desde ./simulador.js
export const handlers = [
    // Lista de categorías
    http.get("/api/categorias", async () => {
        await delay(800);
        return HttpResponse.json(categorias);
    }),

    // Libros de una categoría
    http.get("/api/categorias/:slug/libros", async ({ params }) => {
        await delay(1000);

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