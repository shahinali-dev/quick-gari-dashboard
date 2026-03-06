import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetUsersParams } from "@/hooks";
import { useDebounce } from "@/hooks";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UsersFiltersProps {
  params: GetUsersParams;
  onParamsChange: (params: GetUsersParams) => void;
  isLoading?: boolean;
}

export default function UsersFilters({
  params,
  onParamsChange,
  isLoading = false,
}: UsersFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  // Use ref to always have latest params without adding it as a dependency
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Only runs when debouncedSearch actually changes — no infinite loop
  useEffect(() => {
    onParamsChange({
      ...paramsRef.current,
      search: debouncedSearch,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleRoleChange = (value: string) => {
    onParamsChange({
      ...params,
      role:
        value === "all" ? undefined : (value as "admin" | "car_owner" | "user"),
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onParamsChange({
      ...params,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onParamsChange({ page: 1, limit: params.limit ?? 10 });
  };

  const hasActiveFilters = !!(searchInput || params.role || params.sortBy);

  return (
    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 pr-9 h-9 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <Select
          value={params.role || "all"}
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="car_owner">Car Owner</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${params.sortBy || "createdAt"}-${params.sortOrder || "desc"}`}
          onValueChange={handleSortChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A–Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z–A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="h-9 text-sm gap-2 text-gray-600 hover:text-gray-900"
          >
            <X size={14} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
