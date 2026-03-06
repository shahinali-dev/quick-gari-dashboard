import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────

export interface CarFeatures {
  _id: string;
  vehicleType: string;
  model: string;
  brand: string;
  fuelType: string;
  gearType: string;
  images: string[];
  seatCapacity: number;
  manufactureYear: number;
}

export interface VehicleRegistration {
  _id: string;
  registrationNumber: string;
  registration: number;
  taxTokenPhoto: string;
  registrationCardPhoto: string;
}

export interface CarRegistrationRequest {
  _id: string;
  carName: string;
  features: CarFeatures;
  vehicleRegistration: VehicleRegistration;
  drivingLicensePhoto: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarRegistrationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CarRegistrationRequest[];
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

export interface GetCarRegistrationParams {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useGetAllCarRegistrationRequest(
  params: GetCarRegistrationParams = {},
) {
  return useQuery({
    queryKey: ["car-registration-requests", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.isApproved !== undefined)
        queryParams.append("isApproved", params.isApproved.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<CarRegistrationResponse>(
        `/api/v1/car/admin/registration/requests?${queryParams.toString()}`,
      );

      return response.data;
    },
    staleTime: 1000 * 60,
  });
}
