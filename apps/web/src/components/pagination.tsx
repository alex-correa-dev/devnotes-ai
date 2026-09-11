'use client';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-between border-t pt-4">
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        ← Anterior
      </button>

      <span className="text-sm text-gray-600">
        Página {currentPage + 1} de {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        Próxima →
      </button>
    </nav>
  );
}
