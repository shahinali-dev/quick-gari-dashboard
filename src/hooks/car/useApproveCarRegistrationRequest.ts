import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useApproveCarRegistrationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.patch(`/api/v1/car/${requestId}/approve`);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Car approved successfully");
      queryClient.invalidateQueries({
        queryKey: ["car-registration-requests"],
      });
    },
    onError: () => {
      toast.error("Failed to approve car");
    },
  });
}
