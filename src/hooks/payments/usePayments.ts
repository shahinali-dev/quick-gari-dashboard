// hooks/usePayments.ts
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING";
export type PaymentFor = "RIDE" | "RETURN" | "SHARE_VEHICLE";

export interface PendingPaymentUser {
  _id: string;
  name: string;
  phoneNumber: string;
}

export interface PendingPayment {
  _id: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paymentFor: PaymentFor;
  rideId: Record<string, unknown> | null;
  returnId: Record<string, unknown> | null;
  shareVehicleBookingId: Record<string, unknown> | null;
  userId: PendingPaymentUser;
  status: PaymentStatus;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingPaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PendingPayment[];
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

export interface GetPendingPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApprovePaymentPayload {
  approved: boolean;
  rejectionReason?: string;
}
// hooks/usePayments.ts এ add koro

export interface PaymentDetail {
  _id: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paymentFor: PaymentFor;
  rideId: Record<string, unknown> | null;
  returnId: Record<string, unknown> | null;
  shareVehicleBookingId: Record<string, unknown> | null;
  userId: PendingPaymentUser;
  status: PaymentStatus;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentDetail;
}

// ─── Hooks ────────────────────────────────────────────────────────

export function useGetPendingPayments(params: GetPendingPaymentsParams = {}) {
  return useQuery({
    queryKey: ["pending-payments", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.get<PendingPaymentsResponse>(
        `/api/v1/payment/pending/all?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: ApprovePaymentPayload;
    }) => {
      const response = await api.post(
        `/api/v1/payment/approve/${paymentId}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment approved successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
    },
    onError: () => {
      toast.error("Failed to approve payment");
    },
  });
}

export function useGetPaymentById(paymentId: string | null) {
  return useQuery({
    queryKey: ["payment-detail", paymentId],
    queryFn: async () => {
      const response = await api.get<PaymentDetailResponse>(
        `/api/v1/payment/${paymentId}`,
      );
      return response.data.data;
    },
    enabled: !!paymentId,
    staleTime: 1000 * 30,
  });
}
