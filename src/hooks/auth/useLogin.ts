import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: "admin" | "car_owner";
      phoneNumber?: string;
      gender?: string;
      isCarOwner?: boolean;
      isVerified?: boolean;
      avatar?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export function useLogin() {
  const { setUser } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/api/v1/auth/signin`,
        credentials,
      );
      return response.data;
    },
    onSuccess: (data) => {
      const userData = {
        _id: data.data.user._id,
        id: data.data.user._id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        avatar: data.data.user.avatar ?? undefined, // null → undefined
      };

      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(userData);
    },
  });
}
