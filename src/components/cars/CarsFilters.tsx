import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetAllCarsParams } from "@/hooks";
import { useDebounce } from "@/hooks";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CarsFiltersProps {
  params: GetAllCarsParams;
  onParamsChange: (params: GetAllCarsParams) => void;
  isLoading?: boolean;
}

export default function CarsFilters({
  params,
  onParamsChange,
  isLoading = false,
}: CarsFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  // Use ref to always have latest params without adding it as a dependency
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Only runs when debouncedSearch actually changes — no infinite loop
  useEffect(() => {
    onParamsChange({
      ...paramsRef.current,
      search: debouncedSearch || undefined,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleFilterChange = (isApproved: boolean | null) => {
    onParamsChange({
      ...params,
      isApproved: isApproved !== null ? isApproved : undefined,
      page: 1,
    });
  };

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
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = !!(
    searchInput ||
    params.isApproved !== undefined ||
    params.sortBy !== "createdAt" ||
    params.sortOrder !== "desc"
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search by car name..."
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

        {/* Status Filter */}
        <Select
          value={
            params.isApproved !== undefined
              ? params.isApproved.toString()
              : "all"
          }
          onValueChange={(value) => {
            if (value === "all") handleFilterChange(null);
            else if (value === "true") handleFilterChange(true);
            else handleFilterChange(false);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${params.sortBy || "createdAt"}-${params.sortOrder || "desc"}`}
          onValueChange={handleSortChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="carName-asc">Car Name (A-Z)</SelectItem>
            <SelectItem value="carName-desc">Car Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
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
