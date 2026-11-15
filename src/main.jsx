import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";

async function iniciarAplicacion() {
  // El mock solo se carga en desarrollo (npm run dev)
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
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