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
import type { GetUsersParams } from "@/hooks";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

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

  // Update params when debounced search changes
  useEffect(() => {
    onParamsChange({
      ...params,
      search: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

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
    onParamsChange({
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 pr-10"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
          />
          {searchInput && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <Select
          value={params.role || "all"}
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger>
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
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {(searchInput || params.role || params.sortBy) && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="gap-2"
          >
            <X size={16} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
