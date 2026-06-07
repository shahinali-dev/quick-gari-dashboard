// components/payments/PaymentFilters.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks";
import type { GetPendingPaymentsParams } from "@/hooks/usePayments";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PaymentFiltersProps {
  params: GetPendingPaymentsParams;
  onParamsChange: (params: GetPendingPaymentsParams) => void;
  isLoading?: boolean;
}

export default function PaymentFilters({
  params,
  onParamsChange,
  isLoading = false,
}: PaymentFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    onParamsChange({
      ...paramsRef.current,
      search: debouncedSearch || undefined,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onParamsChange({
      ...params,
      sortBy: sortBy || undefined,
      sortOrder: (sortOrder as "asc" | "desc") || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onParamsChange({
      page: 1,
      limit: params.limit ?? 10,
      sortBy: "submittedAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = !!(
    searchInput ||
    params.sortBy !== "submittedAt" ||
    params.sortOrder !== "desc"
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={`${params.sortBy || "submittedAt"}-${params.sortOrder || "desc"}`}
          onValueChange={handleSortChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submittedAt-desc">Newest First</SelectItem>
            <SelectItem value="submittedAt-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Amount (High-Low)</SelectItem>
            <SelectItem value="amount-asc">Amount (Low-High)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="h-10 text-sm gap-2 text-gray-600 hover:text-gray-900"
          >
            <X size={16} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
