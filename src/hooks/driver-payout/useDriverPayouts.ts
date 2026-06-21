// hooks/useDriverPayouts.ts
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────

export type PayoutType = "ride" | "return" | "shareVehicleBooking";

export interface DriverPayout {
  _id: string;
  startLocation?: string;
  endLocation?: string;
  pickupStop?: string;
  dropStop?: string;
  fare?: number;
  totalFare?: number;
  serviceCharge?: number;
  driverPayoutCompleted: boolean;
  driver?: {
    _id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
  };
  passenger?: {
    _id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
  };
  user?: {
    _id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
  };
  car?: {
    _id: string;
    carName: string;
    features?: string[];
  };
  shareVehicle?: {
    _id: string;
    vehicle: {
      carName: string;
      driverName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface MetaInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PendingDriverPayoutsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: {
      rides: DriverPayout[];
      returns: DriverPayout[];
      shareVehicleBookings: DriverPayout[];
    };
    meta: {
      rides: MetaInfo;
      returns: MetaInfo;
      shareVehicleBookings: MetaInfo;
    };
  };
}

export interface GetDriverPayoutsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Hooks ────────────────────────────────────────────────────────

export function useGetPendingDriverPayouts(
  params: GetDriverPayoutsParams = {},
) {
  return useQuery({
    queryKey: ["driver-payouts-pending", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<PendingDriverPayoutsResponse>(
        `/api/v1/driver-payout/pending?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCompleteDriverPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: PayoutType }) => {
      const response = await api.patch(
        `/api/v1/driver-payout/${id}/complete?type=${type}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Driver payout completed successfully");
      queryClient.invalidateQueries({ queryKey: ["driver-payouts-pending"] });
    },
    onError: () => {
      toast.error("Failed to complete driver payout");
    },
  });
}
