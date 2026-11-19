// Configuración leída desde las variables de entorno de Vite (archivo .env)

// Activa el backend simulado (MSW). Funciona en desarrollo y también en el build de producción.
export const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";