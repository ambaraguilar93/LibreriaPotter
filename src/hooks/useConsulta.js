import { useCallback, useEffect, useState } from "react";
import { invalidar, obtenerOCrear, suscribir } from "../services/cacheConsultas";

// Ejecuta una consulta al servicio y entrega sus estados (datos, cargando y error).
// - clave: identifica la consulta en el caché (por ejemplo "libros:fantasia").
// - consultar: función estable que recibe { signal } y devuelve una promesa.
export function useConsulta(clave, consultar) {
    const [intento, setIntento] = useState(0);
    const [resultado, setResultado] = useState({ intento: -1, datos: null, error: "" });

    useEffect(() => {
        let vigente = true;

        const entrada = obtenerOCrear(clave, consultar);
        const retirarse = suscribir(clave, entrada);

        entrada.promesa
            .then((datos) => {
                if (vigente) setResultado({ intento, datos, error: "" });
            })
            .catch((error) => {
                // Una petición cancelada no es un error que deba ver la persona usuaria
                if (!vigente || error.tipo === "cancelada") return;

                // Si falla, se conservan los últimos datos cargados
                setResultado((previo) => ({ ...previo, intento, error: error.message }));
            });

        // Si el componente se desmonta o la consulta cambia, se ignora esta respuesta
        // y, si nadie más la espera, la petición se cancela.
        return () => {
            vigente = false;
            retirarse();
        };
    }, [clave, consultar, intento]);

    // Invalida la clave y vuelve a consultar al servicio
    const recargar = useCallback(() => {
        invalidar(clave);
        setIntento((previo) => previo + 1);
    }, [clave]);

    // Está cargando mientras no llegue la respuesta de la petición actual
    const cargando = resultado.intento !== intento;

    return {
        datos: resultado.datos,
        error: cargando ? "" : resultado.error,
        cargando,
        recargar,
    };
}