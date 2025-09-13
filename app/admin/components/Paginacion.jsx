export default function Paginacion({ paginaActual, totalPaginas, onPageChange }) {
    if (totalPaginas <= 1) return null;

    return (
        <div className="mt-4 flex justify-center items-center gap-2 flex-wrap">
            <button
                onClick={() => onPageChange(Math.max(paginaActual - 1, 1))}
                disabled={paginaActual === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
                ← Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded text-sm font-medium ${page === paginaActual
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min(paginaActual + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
                Siguiente →
            </button>
        </div>
    );
}
