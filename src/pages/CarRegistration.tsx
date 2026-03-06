import PaginationComponent from "@/components/common/Pagination";
import CarRegistrationFilters from "@/components/cars/CarRegistrationFilters";
import CarRegistrationTable from "@/components/cars/CarRegistrationTable";
import {
  useApproveCarRegistrationRequest,
  useGetAllCarRegistrationRequest,
  type GetCarRegistrationParams,
} from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CarRegistration() {
  const navigate = useNavigate();
  const [params, setParams] = useState<GetCarRegistrationParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [approvingId, setApprovingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllCarRegistrationRequest(params);
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveCarRegistrationRequest();

  const handleParamsChange = (newParams: GetCarRegistrationParams) => {
    setParams(newParams);
  };

  const handleView = (requestId: string) => {
    navigate(`/car-registration/${requestId}`);
  };

  const handleApprove = (requestId: string) => {
    setApprovingId(requestId);
    approveRequest(requestId, {
      onSuccess: () => {
        setApprovingId(null);
      },
      onError: () => {
        setApprovingId(null);
      },
    });
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
          Car Registration Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve car registration requests from users
        </p>
      </div>

      <CarRegistrationFilters
        params={params}
        onParamsChange={handleParamsChange}
        isLoading={isLoading}
      />

      <CarRegistrationTable
        requests={data?.data || []}
        isLoading={isLoading}
        isApproving={isApproving}
        approvingId={approvingId}
        onView={handleView}
        onApprove={handleApprove}
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
