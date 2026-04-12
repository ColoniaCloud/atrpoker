import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const sep = basePath.includes("?") ? "&" : "?";

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Paginación">
      {/* Anterior */}
      {currentPage > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}${sep}page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
      )}

      {/* Números de página */}
      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-sm text-muted-foreground">…</span>
            )}
            <Button
              asChild={page !== currentPage}
              variant={page === currentPage ? "default" : "ghost"}
              size="icon"
              className={cn("h-9 w-9", page === currentPage && "pointer-events-none")}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page === currentPage ? (
                <span>{page}</span>
              ) : (
                <Link href={`${basePath}${sep}page=${page}`}>{page}</Link>
              )}
            </Button>
          </span>
        );
      })}

      {/* Siguiente */}
      {currentPage < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}${sep}page=${currentPage + 1}`}>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </nav>
  );
}
