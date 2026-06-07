// hooks/useShareVehicleFare.ts
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────

export interface ShareVehicleFare {
  _id: string;
  fromLocation: string;
  toLocation: string;
  perSeatFare: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShareVehicleFareResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ShareVehicleFare[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetShareVehicleFareParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FarePayload {
  fromLocation: string;
  toLocation: string;
  perSeatFare: number;
}

// ─── Hooks ────────────────────────────────────────────────────────

export function useGetAllFares(params: GetShareVehicleFareParams = {}) {
  return useQuery({
    queryKey: ["share-vehicle-fares", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<ShareVehicleFareResponse>(
        `/api/v1/share-vehicle-fare?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateFare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FarePayload) => {
      const response = await api.post("/api/v1/share-vehicle-fare", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Fare created successfully");
      queryClient.invalidateQueries({ queryKey: ["share-vehicle-fares"] });
    },
    onError: () => {
      toast.error("Failed to create fare");
    },
  });
}

export function useUpdateFare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: FarePayload;
    }) => {
      const response = await api.put(
        `/api/v1/share-vehicle-fare/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Fare updated successfully");
      queryClient.invalidateQueries({ queryKey: ["share-vehicle-fares"] });
    },
    onError: () => {
      toast.error("Failed to update fare");
    },
  });
}

export function useDeleteFare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/v1/share-vehicle-fare/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Fare deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["share-vehicle-fares"] });
    },
    onError: () => {
      toast.error("Failed to delete fare");
    },
  });
}
