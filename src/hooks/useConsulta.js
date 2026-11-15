import { useCallback, useEffect, useState } from "react";

// Caché que guarda la promesa de cada consulta ya realizada.
const cache = new Map();


// Ejecuta una consulta al servicio y entrega sus tres estados (datos, cargando y error).
export function useConsulta(servicio, parametro = "") {
    const clave = `${servicio.name}:${parametro}`;

    const [peticion, setPeticion] = useState({ intento: 0, tipoError: "" });
    const [resultado, setResultado] = useState({ intento: -1, datos: null, error: "" });

    useEffect(() => {
        let vigente = true;
        let promesa = cache.get(clave);

        if (!promesa || peticion.tipoError) {
            promesa = servicio(parametro, peticion.tipoError);

            if (!peticion.tipoError) {
                cache.set(clave, promesa);
                // Una consulta fallida no se guarda y se puede reintentar
                promesa.catch(() => cache.delete(clave));
            }
        }

        promesa
            .then((datos) => {
                if (vigente) setResultado({ intento: peticion.intento, datos, error: "" });
            })
            .catch((error) => {
                // Si falla, se conservan los últimos datos cargados
                if (vigente) setResultado((previo) => ({ ...previo, intento: peticion.intento, error: error.message }));
            });

        // Si el componente se desmonta o la consulta cambia, se ignora esta respuesta
        return () => {
            vigente = false;
        };
    }, [servicio, parametro, clave, peticion]);

    // Vuelve a consultar al servicio. tipoError ("404" o "500") permite simular un fallo.
    const recargar = useCallback(
        (tipoError = "") => {
            cache.delete(clave);
            setPeticion((previa) => ({ intento: previa.intento + 1, tipoError }));
        },
        [clave],
    );

    // Está cargando mientras no llegue la respuesta de la petición actual
    const cargando = resultado.intento !== peticion.intento;

    return {
        datos: resultado.datos,
        error: cargando ? "" : resultado.error,
        cargando,
        recargar,
    };
}