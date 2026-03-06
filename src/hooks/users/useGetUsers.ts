import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "car_owner" | "user";
  phoneNumber?: string;
  isVerified?: boolean;
  isCarOwner?: boolean;
  createdAt?: string;
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "admin" | "car_owner" | "user";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useGetUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.role) queryParams.append("role", params.role);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<UsersResponse>(
        `/api/v1/user/users?${queryParams.toString()}`,
      );

      return response.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
