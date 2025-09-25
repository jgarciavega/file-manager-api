export default function Paginacion({ pagina, totalPaginas, onChangePagina }) {
    const handleChangePagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            onChangePagina(nuevaPagina);
        }
    };

    return (
        <div className="flex justify-center items-center space-x-4 mt-6">
            <button
                className="px-4 py-2 rounded border disabled:opacity-50"
                onClick={() => handleChangePagina(pagina - 1)}
                disabled={pagina === 1}
            >
                Anterior
            </button>
            <span>
                Página {pagina} de {totalPaginas}
            </span>
            <button
                className="px-4 py-2 rounded border disabled:opacity-50"
                onClick={() => handleChangePagina(pagina + 1)}
                disabled={pagina === totalPaginas}
            >
                Siguiente
            </button>
        </div>
    );
}
