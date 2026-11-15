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

El backend simulado solo se activa en modo desarrollo (`npm run dev`).

## API mock

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/categorias` | Lista de categorías |
| GET | `/api/categorias/:slug/libros` | Categoría y sus libros, 404 si la categoría no existe |

Ambas rutas aceptan `?error=404` o `?error=500` para simular fallos del servicio.

## Estructura

    src/
      mocks/        Datos y handlers del servicio simulado (MSW)
      services/     Comunicación con la API (fetch y mensajes de error)
      hooks/        useConsulta: estados de datos, carga y error, caché y reintento
      components/   Layout, lista de libros, tarjeta, indicador de carga, mensaje de error
      pages/        Inicio, Categoría y Página no encontrada

## Qué se puede probar

- Carga: indicador visible mientras se espera cada respuesta.
- Errores: botones "Simular error 404" y "Simular error 500" dentro de una categoría,
  con mensaje claro, opción "Reintentar" y enlace para volver a las categorías.
- Categoría sin libros: Poesía.
- Categoría inexistente: `/categoria/terror` (el servicio responde 404).
- Ruta inexistente: cualquier otra dirección muestra "Página no encontrada".
- Consultas sin repetición: al volver a una categoría ya visitada no se hace una nueva
  petición (se puede comprobar en la pestaña Network).