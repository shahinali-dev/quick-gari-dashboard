import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllCars,
  type GetAllCarsParams,
} from "@/hooks";
import PaginationComponent from "@/components/common/Pagination";
import CarsFilters from "@/components/cars/CarsFilters";
import CarsTable from "@/components/cars/CarsTable";

export default function Cars() {
  const navigate = useNavigate();
  const [params, setParams] = useState<GetAllCarsParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useGetAllCars(params);

  const handleParamsChange = useCallback((newParams: GetAllCarsParams) => {
    setParams(newParams);
  }, []);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleLimitChange = (limit: number) => {
    setParams({ ...params, limit, page: 1 });
  };

  const handleView = (carId: string) => {
    navigate(`/cars/${carId}`);
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
          Cars Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all cars, search, filter, and sort by different criteria
        </p>
      </div>

      <CarsFilters
        params={params}
        onParamsChange={handleParamsChange}
        isLoading={isLoading}
      />

      <CarsTable
        cars={data?.data || []}
        isLoading={isLoading}
        onView={handleView}
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
