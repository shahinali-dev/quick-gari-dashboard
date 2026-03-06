import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────

export interface CarFeatures {
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
  registrationNumber: string;
  registration: number;
  taxTokenPhoto: string;
  registrationCardPhoto: string;
}

export interface Car {
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

export interface CarsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Car[];
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

export interface GetAllCarsParams {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useGetAllCars(params: GetAllCarsParams = {}) {
  return useQuery({
    queryKey: ["all-cars", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.isApproved !== undefined)
        queryParams.append("isApproved", params.isApproved.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<CarsResponse>(
        `/api/v1/car?${queryParams.toString()}`,
      );

      return response.data;
    },
    staleTime: 1000 * 60,
  });
}
