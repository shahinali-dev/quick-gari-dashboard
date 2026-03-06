import PaginationComponent from "@/components/common/Pagination";
import UsersFilters from "@/components/users/UsersFilters";
import UsersTable from "@/components/users/UsersTable";
import type { GetUsersParams } from "@/hooks";
import { useGetUsers } from "@/hooks";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetUsers(params);
  console.log("Users data:", data);

  const navigate = useNavigate();

  const handleParamsChange = useCallback((newParams: GetUsersParams) => {
    setParams(newParams);
  }, []);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleLimitChange = (limit: number) => {
    setParams({ ...params, limit, page: 1 });
  };

  const paginationData = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  const handleOnViewUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Users Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all users, search, filter, and sort by different criteria
        </p>
      </div>

      <UsersFilters
        params={params}
        onParamsChange={handleParamsChange}
        isLoading={isLoading}
      />

      <UsersTable
        users={data?.data || []}
        isLoading={isLoading}
        onView={handleOnViewUser}
      />

      <PaginationComponent
        page={paginationData.page}
        totalPages={paginationData.pages}
        limit={paginationData.limit}
        total={paginationData.total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
      />
    </div>
  );
}
