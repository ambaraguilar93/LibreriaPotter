// Datos simulados del "backend". Solo los usa el mock.

export const categorias = [
    { slug: "ficcion", nombre: "Ficción", descripcion: "Novelas y relatos de la literatura universal." },
    { slug: "ciencia-ficcion", nombre: "Ciencia Ficción", descripcion: "Futuros posibles, tecnología y otros mundos." },
    { slug: "fantasia", nombre: "Fantasía", descripcion: "Magia, reinos imaginarios y grandes aventuras." },
    { slug: "misterio", nombre: "Misterio", descripcion: "Crímenes, detectives y casos por resolver." },
    { slug: "poesia", nombre: "Poesía", descripcion: "Versos clásicos y contemporáneos." },
];

export const librosPorCategoria = {
    ficcion: [
        { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 16990 },
        { id: 2, titulo: "La casa de los espíritus", autor: "Isabel Allende", precio: 14990 },
        { id: 3, titulo: "Rayuela", autor: "Julio Cortázar", precio: 15990 },
    ],
    "ciencia-ficcion": [
        { id: 4, titulo: "Dune", autor: "Frank Herbert", precio: 18990 },
        { id: 5, titulo: "Fundación", autor: "Isaac Asimov", precio: 13990 },
        { id: 6, titulo: "Fahrenheit 451", autor: "Ray Bradbury", precio: 11990 },
    ],
    fantasia: [
        { id: 7, titulo: "El hobbit", autor: "J. R. R. Tolkien", precio: 14990 },
        { id: 8, titulo: "Un mago de Terramar", autor: "Ursula K. Le Guin", precio: 12990 },
    ],
    misterio: [
        { id: 9, titulo: "Asesinato en el Orient Express", autor: "Agatha Christie", precio: 10990 },
        { id: 10, titulo: "El nombre de la rosa", autor: "Umberto Eco", precio: 17990 },
    ],
    // Categoría sin libros a propósito para probar la pantalla "sin resultados".
    poesia: [],
};