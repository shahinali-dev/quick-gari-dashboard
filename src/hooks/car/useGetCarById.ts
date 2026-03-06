import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { type Car } from "./useGetAllCars";

export interface CarDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Car;
}

export function useGetCarById(carId: string | null) {
  return useQuery({
    queryKey: ["car", carId],
    queryFn: async () => {
      if (!carId) return null;

      const response = await api.get<CarDetailResponse>(
        `/api/v1/car/admin/${carId}`,
      );

      return response.data.data;
    },
    enabled: !!carId,
    staleTime: 1000 * 60,
  });
}
