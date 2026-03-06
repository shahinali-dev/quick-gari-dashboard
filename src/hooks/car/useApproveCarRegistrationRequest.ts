import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useApproveCarRegistrationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.patch(`/api/v1/car/${requestId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("car-registration-requests");
    },
  });
}
