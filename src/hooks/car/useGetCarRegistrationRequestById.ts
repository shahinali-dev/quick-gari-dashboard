import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { CarRegistrationRequest } from "./useGetAllCarRegistrationRequest";

interface CarRegistrationDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CarRegistrationRequest;
}

export function useGetCarRegistrationRequestById(requestId: string | null) {
  return useQuery({
    queryKey: ["car-registration-request", requestId],
    queryFn: async () => {
      if (!requestId) return null;

      const response = await api.get<CarRegistrationDetailResponse>(
        `/api/v1/car/registration-request/${requestId}`,
      );

      return response.data.data;
    },
    enabled: !!requestId,
    staleTime: 1000 * 60, // 1 minute
  });
}
