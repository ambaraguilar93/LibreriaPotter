import { useParams } from "react-router";
import ListaLibros from "../components/ListaLibros";

export default function Categoria() {
    const { slug } = useParams();

    // Al cambiar de categoría, la lista parte con un estado limpio
    return <ListaLibros key={slug} slug={slug} />;
}