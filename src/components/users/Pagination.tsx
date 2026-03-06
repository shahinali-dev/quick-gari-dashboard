import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show: 1, ..., [page-1, page, page+1], ..., last
  const pages: (number | "...")[] = [];

  pages.push(1);

  if (page > 3) {
    pages.push("...");
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export default function PaginationComponent({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: PaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-6 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Left — result count */}
      <p className="text-sm text-gray-500 whitespace-nowrap shrink-0">
        Showing{" "}
        <span className="font-semibold text-gray-800">
          {startItem}–{endItem}
        </span>{" "}
        of <span className="font-semibold text-gray-800">{total}</span> results
      </p>

      {/* Center — page numbers */}
      <Pagination className="mx-0 w-auto flex-1">
        <PaginationContent className="gap-1 flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => !isLoading && page > 1 && onPageChange(page - 1)}
              className={cn(
                "h-8 px-3 text-xs rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors select-none whitespace-nowrap",
                (page === 1 || isLoading) && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>

          {pages.map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis className="h-8 w-8 text-gray-400" />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => !isLoading && onPageChange(p as number)}
                  className={cn(
                    "h-8 w-8 text-xs rounded-lg border transition-colors select-none cursor-pointer",
                    p === page
                      ? "bg-amber-500 border-amber-500 text-gray-950 font-semibold hover:bg-amber-600 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    isLoading && "pointer-events-none opacity-60",
                  )}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                !isLoading && page < totalPages && onPageChange(page + 1)
              }
              className={cn(
                "h-8 px-3 text-xs rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors select-none whitespace-nowrap",
                (page === totalPages || isLoading) &&
                  "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Right — rows per page */}
      <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
        <span className="text-sm text-gray-500">Rows per page</span>
        <Select
          value={limit.toString()}
          onValueChange={(v) => onLimitChange(Number(v))}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 w-16 text-xs rounded-lg border-gray-200 focus:ring-amber-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={n.toString()} className="text-xs">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
