// Capa de comunicación con la API REST.

const MENSAJES_POR_DEFECTO = {
    404: "No encontramos la información solicitada.",
    500: "El servicio tuvo un problema interno. Intenta nuevamente en unos segundos.",
};

async function solicitar(ruta, tipoError = "", mensajes = {}) {
    const endpoint = tipoError ? `${ruta}?error=${tipoError}` : ruta;
    let respuesta;

    try {
        respuesta = await fetch(endpoint);
    } catch (causa) {
        // fetch solo rechaza cuando no hay conexión con el servidor
        throw new Error("No fue posible conectarse al servicio. Revisa tu conexión e intenta nuevamente.", { cause: causa });
    }

    if (!respuesta.ok) {
        const mensaje =
            mensajes[respuesta.status] ??
            MENSAJES_POR_DEFECTO[respuesta.status] ??
            `Ocurrió un error inesperado (código ${respuesta.status}).`;

        throw new Error(mensaje);
    }

    return respuesta.json();
}

export function obtenerCategorias(_parametro, tipoError) {
    return solicitar("/api/categorias", tipoError, {
        404: "No encontramos el listado de categorías.",
    });
}

export function obtenerLibrosPorCategoria(slug, tipoError) {
    return solicitar(`/api/categorias/${encodeURIComponent(slug)}/libros`, tipoError, {
        404: "La categoría que buscas no existe en la tienda.",
    });
}