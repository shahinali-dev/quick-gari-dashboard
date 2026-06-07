// pages/ShareVehicleFares.tsx
import PaginationComponent from "@/components/common/Pagination";
import FareFormModal from "@/components/fares/FareFormModal";
import FareTable from "@/components/fares/FareTable";
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
import {
  useCreateFare,
  useDeleteFare,
  useGetAllFares,
  useUpdateFare,
  type GetShareVehicleFareParams,
} from "@/hooks/shareVehicleFare/useShareVehicleFare";

import { Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ShareVehicleFares() {
  const [params, setParams] = useState<GetShareVehicleFareParams>({
    page: 1,
    limit: 10,
    sortBy: "fromLocation",
    sortOrder: "asc",
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    setParams({
      ...paramsRef.current,
      search: debouncedSearch || undefined,
      page: 1,
    });
  }, [debouncedSearch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFare, setEditingFare] = useState<ShareVehicleFare | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllFares(params);
  const { mutate: createFare, isPending: isCreating } = useCreateFare();
  const { mutate: updateFare, isPending: isUpdating } = useUpdateFare();
  const { mutate: deleteFare } = useDeleteFare();

  const handleEdit = (fare: ShareVehicleFare) => {
    setEditingFare(fare);
    setModalOpen(true);
  };

  const handleDelete = (fareId: string) => {
    setDeletingId(fareId);
    deleteFare(fareId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    });
  };

  const handleSubmit = (payload: FarePayload) => {
    if (editingFare) {
      updateFare(
        { id: editingFare._id, payload },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingFare(null);
          },
        },
      );
    } else {
      createFare(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    setParams({
      ...params,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setParams({
      page: 1,
      limit: params.limit,
      sortBy: "fromLocation",
      sortOrder: "asc",
    });
  };

  const hasActiveFilters = !!(
    searchInput ||
    params.sortBy !== "fromLocation" ||
    params.sortOrder !== "asc"
  );

  const paginationData = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Share Vehicle Fares
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage per-seat fare configurations for share vehicle routes
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFare(null);
            setModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Add Fare
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search location..."
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

          <Select
            value={`${params.sortBy || "fromLocation"}-${params.sortOrder || "asc"}`}
            onValueChange={handleSortChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fromLocation-asc">From (A-Z)</SelectItem>
              <SelectItem value="fromLocation-desc">From (Z-A)</SelectItem>
              <SelectItem value="perSeatFare-asc">Fare (Low-High)</SelectItem>
              <SelectItem value="perSeatFare-desc">Fare (High-Low)</SelectItem>
            </SelectContent>
          </Select>

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

      <FareTable
        fares={data?.data || []}
        isLoading={isLoading}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PaginationComponent
        page={paginationData.page}
        totalPages={paginationData.totalPages}
        limit={paginationData.limit}
        total={paginationData.total}
        onPageChange={(p) => setParams({ ...params, page: p })}
        onLimitChange={(l) => setParams({ ...params, limit: l, page: 1 })}
        isLoading={isLoading}
      />

      <FareFormModal
        open={modalOpen}
        editingFare={editingFare}
        isSubmitting={isCreating || isUpdating}
        onClose={() => {
          setModalOpen(false);
          setEditingFare(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
