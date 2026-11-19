// Herramienta de desarrollo para probar cómo responde la interfaz ante fallos.
// Usa worker.use() de MSW: agrega un handler que responde UNA sola vez
// por encima de los handlers normales. El servicio no se entera de la simulación.
import { http, HttpResponse, delay } from "msw";
import { worker } from "./browser";

export const ESCENARIOS = {
    404: {
        responder: () => HttpResponse.json({ message: "Not Found" }, { status: 404 }),
    },
    500: {
        responder: () => HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
    },
    red: {
        responder: () => HttpResponse.error(),
    },
    demora: {
        // Nunca responde, el tiempo límite del servicio corta la espera
        responder: async () => {
            await delay("infinite");
        },
    },
    "json-invalido": {
        responder: () =>
            new HttpResponse("<html>Esto no es JSON</html>", {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
    },
};

// ruta: patrón de MSW, por ejemplo "/api/categorias" o "/api/categorias/:slug/libros"
export function simularFallo(ruta, escenario) {
    const { responder } = ESCENARIOS[escenario];
    worker.use(http.get(ruta, responder, { once: true }));
}