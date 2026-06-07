// pages/PaymentRequests.tsx

import PaginationComponent from "@/components/common/Pagination";
import PaymentFilters from "@/components/payments/PaymentFilters";
import PaymentTable from "@/components/payments/PaymentTable.tsx";
import {
  useApprovePayment,
  useGetPendingPayments,
  type GetPendingPaymentsParams,
} from "@/hooks/payments/usePayments";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentRequests() {
  const navigate = useNavigate();

  const [params, setParams] = useState<GetPendingPaymentsParams>({
    page: 1,
    limit: 10,
    sortBy: "submittedAt",
    sortOrder: "desc",
  });

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const { data, isLoading } = useGetPendingPayments(params);
  const { mutate: approvePayment } = useApprovePayment();

  const handleParamsChange = (newParams: GetPendingPaymentsParams) => {
    setParams(newParams);
  };

  const handleView = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleApprove = (paymentId: string) => {
    setApprovingId(paymentId);
    approvePayment(
      { paymentId, payload: { approved: true } },
      {
        onSuccess: () => setApprovingId(null),
        onError: () => setApprovingId(null),
      },
    );
  };

  const handleReject = (paymentId: string) => {
    setRejectingId(paymentId);
    approvePayment(
      {
        paymentId,
        payload: { approved: false, rejectionReason: "Rejected by admin" },
      },
      {
        onSuccess: () => setRejectingId(null),
        onError: () => setRejectingId(null),
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    setParams({ ...params, page: newPage });
  };

  const handleLimitChange = (limit: number) => {
    setParams({ ...params, limit, page: 1 });
  };

  const paginationData = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Payment Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve pending payment requests from users
        </p>
      </div>

      <PaymentFilters
        params={params}
        onParamsChange={handleParamsChange}
        isLoading={isLoading}
      />

      <PaymentTable
        payments={data?.data || []}
        isLoading={isLoading}
        approvingId={approvingId}
        rejectingId={rejectingId}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <PaginationComponent
        page={paginationData.page}
        totalPages={paginationData.totalPages}
        limit={paginationData.limit}
        total={paginationData.total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
      />
    </div>
  );
}
