export default function useAutoComplete(form, setForm) {
    return {
        sugerencias: {
            series: [],
            codigos: [],
        },
        validacionEnTiempo: {},
        alertasCalidad: [],
        validarCampo: () => { },
        obtenerSugerenciasMejora: () => [],
    };
}
