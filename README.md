# Librería Potter

Tienda de libros desarrollada en React para la actividad formativa de la Semana 4 de
Desarrollo Frontend II. La aplicación consume una API REST simulada con Mock Service 
Worker (MSW) y permite explorar libros por categoría.

## Tecnologías

- React + Vite
- React Router (`react-router`)
- Mock Service Worker (MSW) para simular el backend REST
- Tailwind CSS

## Cómo ejecutar

Requiere Node.js 20.19 o superior.

    npm install
    npm run dev

Luego abre la dirección que muestra la terminal (por defecto http://localhost:5173).

El backend simulado se controla con variables de entorno en el archivo `.env`:

| Variable | Valor por defecto | Uso |
|---|---|---|
| `VITE_USAR_MOCK` | `true` | Activa MSW. Funciona en `npm run dev` y también en el build de producción |
| `VITE_BASE` | `/` | Ruta base de publicación. Para GitHub Pages: `/LibreriaPotter/` |

Demostración con el build de producción:

    npm run build
    npm run preview

Para probar el build como quedaría en GitHub Pages (subruta):

    VITE_BASE=/LibreriaPotter/ npm run build
    VITE_BASE=/LibreriaPotter/ npm run preview

## API mock

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/categorias` | Lista de categorías |
| GET | `/api/categorias/:slug/libros` | Categoría y sus libros, 404 si la categoría no existe |

Los fallos de prueba no pasan por el servicio: se simulan desde `src/mocks/simulador.js`
con `worker.use()` de MSW, que agrega una respuesta de una sola vez por encima del handler normal.

## Estructura

    src/
      mocks/        Datos y handlers del servicio simulado (MSW)
      mocks/simulador.js  Escenarios de fallo para pruebas (solo se carga al usarlos)
      services/     libreriaService: fetch con tiempo límite, cancelación y errores tipados
                    cacheConsultas: caché con vencimiento, límite e invalidación explícita
      hooks/        useConsulta: estados de datos, carga y error, y reintento
      config.js     Lectura de variables de entorno
      components/   Layout, lista de libros, tarjeta, indicador de carga, mensaje de error
      pages/        Inicio, Categoría y Página no encontrada

## Qué se puede probar

- Carga: indicador visible mientras se espera cada respuesta.
- Errores: el panel "Pruebas del servicio" (en Inicio y en cada categoría) simula
  error 404, error 500, sin conexión, respuesta que nunca llega y datos inválidos.
  Cada caso muestra un mensaje claro, "Reintentar" y enlace para volver a las categorías.
- Tiempo límite: con "Respuesta lenta" la espera se corta a los 8 segundos y se informa el fallo.
- Menú: si falla la consulta de categorías, el menú muestra un aviso con "Recargar menú".
- Caché: las respuestas vencen a los 5 minutos y se guardan como máximo 20 consultas;
  las peticiones que nadie espera se cancelan.
- Categoría sin libros: Poesía.
- Categoría inexistente: `/categoria/terror` (el servicio responde 404).
- Ruta inexistente: cualquier otra dirección muestra "Página no encontrada".
- Consultas sin repetición: al volver a una categoría ya visitada no se hace una nueva
  petición (se puede comprobar en la pestaña Network).