import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { USAR_MOCK } from "./config";
import "./index.css";

async function iniciarAplicacion() {
  // El mock se activa con VITE_USAR_MOCK=true (archivo .env), también en el build de producción
  if (USAR_MOCK) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      // BASE_URL permite publicar en una subruta, por ejemplo /LibreriaPotter/ en GitHub Pages
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledRequest: "bypass",
    });
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

iniciarAplicacion().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);

  document.getElementById("root").textContent =
    "No se pudo iniciar la aplicación. Revisa la consola del navegador.";
});