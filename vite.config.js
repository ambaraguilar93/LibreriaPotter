import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Ruta base de publicación (VITE_BASE en .env). Para GitHub Pages: /LibreriaPotter/
    base: env.VITE_BASE || '/',
    plugins: [react(), tailwindcss()],
  }
})