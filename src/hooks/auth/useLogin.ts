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
    _id: string;
    name: string;
    email: string;
    role: "admin" | "car_owner";
    phoneNumber?: string;
    gender?: string;
    isCarOwner?: boolean;
    isVerified?: boolean;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: {
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
      console.log("Login successful:", data);

      // Map API response to user format
      const userData = {
        id: data.data._id,
        email: data.data.email,
        name: data.data.name,
        role: data.data.role,
        avatar: data.data.avatar,
      };

      const accessToken = data.token.accessToken;
      const refreshToken = data.token.refreshToken;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Update auth context
      setUser(userData);
    },
  });
}
