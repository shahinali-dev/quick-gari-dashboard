import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./useGetUsers";

interface UserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export function useGetUserById(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;

      const response = await api.get<UserResponse>(
        `/api/v1/user/${userId}`,
      );

      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}
