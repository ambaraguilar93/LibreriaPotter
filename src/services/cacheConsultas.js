// Caché de consultas compartido por toda la aplicación.
// Guarda la promesa de cada consulta para que dos componentes que piden lo mismo
// usen una sola petición, con vencimiento, límite de tamaño e invalidación explícita.

// Tiempo que una respuesta exitosa se considera vigente
export const TIEMPO_DE_VIDA_MS = 5 * 60 * 1000;

// Cantidad máxima de consultas guardadas, al superarla se descarta la usada hace más tiempo
export const MAXIMO_ENTRADAS = 20;

// El Map conserva el orden de inserción, la primera clave es la usada hace más tiempo
const entradas = new Map();

function estaVencida(entrada) {
    return !entrada.pendiente && Date.now() - entrada.resueltaEn > TIEMPO_DE_VIDA_MS;
}

function recortarExceso() {
    while (entradas.size > MAXIMO_ENTRADAS) {
        const claveMasAntigua = entradas.keys().next().value;
        entradas.delete(claveMasAntigua);
    }
}

// Elimina la entrada solo si sigue siendo la misma que está en el caché.
// Así, una petición antigua que falla tarde no borra una más reciente con la misma clave.
function eliminarSiCoincide(clave, entrada) {
    if (entradas.get(clave) === entrada) {
        entradas.delete(clave);
    }
}

// Devuelve la entrada vigente de la clave o crea una nueva ejecutando la consulta.
// La consulta recibe un AbortSignal para poder cancelarse.
export function obtenerOCrear(clave, consultar) {
    const existente = entradas.get(clave);

    if (existente && !estaVencida(existente)) {
        // Se vuelve a insertar para marcarla como usada recientemente
        entradas.delete(clave);
        entradas.set(clave, existente);
        return existente;
    }

    const controlador = new AbortController();
    const entrada = {
        controlador,
        pendiente: true,
        resueltaEn: 0,
        suscriptores: 0,
        promesa: null,
    };

    entrada.promesa = consultar({ signal: controlador.signal });
    entrada.promesa.then(
        () => {
            entrada.pendiente = false;
            entrada.resueltaEn = Date.now();
        },
        () => {
            // Una consulta fallida no se guarda, para que se pueda reintentar
            entrada.pendiente = false;
            eliminarSiCoincide(clave, entrada);
        },
    );

    entradas.set(clave, entrada);
    recortarExceso();

    return entrada;
}

// Registra que un componente está esperando la entrada. Devuelve la función para retirarse.
// Si nadie más la espera y la petición sigue en curso, se cancela.
export function suscribir(clave, entrada) {
    entrada.suscriptores += 1;

    return () => {
        entrada.suscriptores -= 1;

        // Se revisa en el siguiente ciclo porque StrictMode desmonta y vuelve a montar
        // de inmediato; si el componente regresa, la petición no se cancela.
        setTimeout(() => {
            if (entrada.suscriptores === 0 && entrada.pendiente) {
                entrada.controlador.abort();
                eliminarSiCoincide(clave, entrada);
            }
        }, 0);
    };
}

// Invalidación explícita: la próxima consulta con esta clave irá al servicio
export function invalidar(clave) {
    entradas.delete(clave);
}

// Invalida todas las claves que empiezan con el prefijo (por ejemplo "libros:")
export function invalidarPorPrefijo(prefijo) {
    for (const clave of [...entradas.keys()]) {
        if (clave.startsWith(prefijo)) {
            entradas.delete(clave);
        }
    }
}

export function limpiarCache() {
    entradas.clear();
}