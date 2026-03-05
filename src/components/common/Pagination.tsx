interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {

    if (totalPages === 0) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-6">

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
                Anterior
            </button>

            <span className="text-sm font-medium">
                Página {page} de {totalPages}
            </span>

            <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
                Siguiente
            </button>

        </div>
    );
};

export default Pagination;