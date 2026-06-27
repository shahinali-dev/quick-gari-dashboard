// pages/DriverPayoutHistory.tsx
import PaginationComponent from "@/components/common/Pagination";
import {
  useGetCompletedDriverPayouts,
  type DriverPayout,
  type GetDriverPayoutsParams,
} from "@/hooks/driver-payout/useDriverPayouts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ActiveTab = "rides" | "returns" | "shareVehicleBookings";

const tabLabels: Record<ActiveTab, string> = {
  rides: "Rides",
  returns: "Returns",
  shareVehicleBookings: "Share Vehicle Bookings",
};

export default function DriverPayoutHistory() {
  const navigate = useNavigate();
  const [params, setParams] = useState<GetDriverPayoutsParams>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("rides");

  const { data, isLoading } = useGetCompletedDriverPayouts(params);

  const activeData = data?.data?.result?.[activeTab] ?? [];
  const activeMeta = data?.data?.meta?.[activeTab];
  const paginationData = activeMeta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const getPassengerOrUser = (item: DriverPayout) =>
    item.user ?? item.passenger ?? null;

  const getLocation = (item: DriverPayout) =>
    item.startLocation
      ? `${item.startLocation} → ${item.endLocation}`
      : `${item.pickupStop} → ${item.dropStop}`;

  const getFare = (item: DriverPayout) => item.fare ?? item.totalFare ?? 0;

  const handlePageChange = (newPage: number) =>
    setParams({ ...params, page: newPage });

  const handleLimitChange = (limit: number) =>
    setParams({ ...params, limit, page: 1 });

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Payout History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All completed driver payouts
          </p>
        </div>
        <button
          onClick={() => navigate("/driver-payouts")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Pending Payouts
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(Object.keys(tabLabels) as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setParams({ ...params, page: 1 });
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tabLabels[tab]}
            {data?.data?.meta?.[tab]?.total !== undefined && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {data.data.meta[tab].total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Passenger</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Fare</th>
              <th className="px-4 py-3 font-medium">Service Charge</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : activeData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No history found
                </td>
              </tr>
            ) : (
              activeData.map((item) => {
                const passengerOrUser = getPassengerOrUser(item);
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.driver?.avatar ? (
                          <img
                            src={item.driver.avatar}
                            alt={item.driver.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            {item.driver?.name?.[0] ?? "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.driver?.name ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.driver?.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {passengerOrUser?.name ?? "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {passengerOrUser?.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {getLocation(item)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ৳{getFare(item)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ৳{item.serviceCharge ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Paid
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/driver-payout-history/${item._id}?type=${activeTab}`,
                          )
                        }
                        className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
