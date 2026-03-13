import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Paginación">
      {/* Anterior */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          ← Anterior
        </Link>
      )}

      {/* Números */}
      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-zinc-600">…</span>
            )}
            <Link
              href={`${basePath}?page=${page}`}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-brand-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {/* Siguiente */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
