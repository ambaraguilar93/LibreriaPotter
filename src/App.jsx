import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Categoria from "./pages/Categoria";
import Inicio from "./pages/Inicio";
import PaginaNoEncontrada from "./pages/PaginaNoEncontrada";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="categoria/:slug" element={<Categoria />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>
    </Routes>
  );
}