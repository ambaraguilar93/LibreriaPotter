// Capa de comunicación con la API REST.
// Solo conoce la API, la simulación de fallos vive en src/mocks/simulador.js.

// Tiempo máximo de espera de cada petición
export const TIEMPO_LIMITE_MS = 8000;

const MENSAJES_POR_DEFECTO = {
    404: "No encontramos la información solicitada.",
    500: "El servicio tuvo un problema interno. Intenta nuevamente en unos segundos.",
};

// Error con el tipo de fallo, para que la interfaz pueda reaccionar según el caso.
// tipo: "red" | "tiempo" | "http" | "formato" | "cancelada"
export class ErrorServicio extends Error {
    constructor(mensaje, { tipo, estado, cause } = {}) {
        super(mensaje, { cause });
        this.name = "ErrorServicio";
        this.tipo = tipo;
        this.estado = estado;
    }
}

function traducirInterrupcion(causa, expiro) {
    if (expiro) {
        return new ErrorServicio("El servicio tardó demasiado en responder. Intenta nuevamente.", {
            tipo: "tiempo",
            cause: causa,
        });
    }
    if (causa?.name === "AbortError") {
        return new ErrorServicio("La consulta fue cancelada.", { tipo: "cancelada", cause: causa });
    }
    // fetch rechaza sin código HTTP cuando no hay conexión con el servidor
    return new ErrorServicio("No fue posible conectarse al servicio. Revisa tu conexión e intenta nuevamente.", {
        tipo: "red",
        cause: causa,
    });
}

async function solicitar(ruta, { signal, mensajes = {} } = {}) {
    // Un controlador propio permite cortar por tiempo límite o por cancelación externa
    const controlador = new AbortController();
    let expiro = false;

    const temporizador = setTimeout(() => {
        expiro = true;
        controlador.abort();
    }, TIEMPO_LIMITE_MS);

    const cancelar = () => controlador.abort();
    if (signal?.aborted) cancelar();
    signal?.addEventListener("abort", cancelar, { once: true });

    try {
        let respuesta;
        try {
            respuesta = await fetch(ruta, { signal: controlador.signal });
        } catch (causa) {
            throw traducirInterrupcion(causa, expiro);
        }

        if (!respuesta.ok) {
            const mensaje =
                mensajes[respuesta.status] ??
                MENSAJES_POR_DEFECTO[respuesta.status] ??
                `Ocurrió un error inesperado (código ${respuesta.status}).`;

            throw new ErrorServicio(mensaje, { tipo: "http", estado: respuesta.status });
        }

        try {
            return await respuesta.json();
        } catch (causa) {
            // La lectura del cuerpo también puede cortarse por tiempo o cancelación
            if (controlador.signal.aborted) throw traducirInterrupcion(causa, expiro);

            throw new ErrorServicio("No se pudieron leer los datos recibidos. Intenta nuevamente más tarde.", {
                tipo: "formato",
                cause: causa,
            });
        }
    } finally {
        clearTimeout(temporizador);
        signal?.removeEventListener("abort", cancelar);
    }
}

export function obtenerCategorias({ signal } = {}) {
    return solicitar("/api/categorias", {
        signal,
        mensajes: { 404: "No encontramos el listado de categorías." },
    });
}

export function obtenerLibrosPorCategoria(slug, { signal } = {}) {
    return solicitar(`/api/categorias/${encodeURIComponent(slug)}/libros`, {
        signal,
        mensajes: { 404: "La categoría que buscas no existe en la tienda." },
    });
}