// pages/DriverPayoutHistoryDetail.tsx
import {
  useGetCompletedDriverPayouts,
  type DriverPayout,
} from "@/hooks/driver-payout/useDriverPayouts";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// Local extended type to handle fields present in API but not in base DriverPayout
interface RidePayoutItem extends DriverPayout {
  status?: string;
  payment?: string;
  rideOtpVerified?: boolean;
}

interface CarFeatures {
  vehicleType?: string;
  model?: string;
  brand?: string;
  fuelType?: string;
  gearType?: string;
  images?: string[];
  seatCapacity?: number;
  manufactureYear?: number;
  [key: string]: unknown;
}

// ─── Icons ────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M7 17a2 2 0 104 0 2 2 0 00-4 0zM17 17a2 2 0 104 0 2 2 0 00-4 0z" />
  </svg>
);
const WalletIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 010-4h14v4M21 12v5H5a2 2 0 000 4h14v-4M21 12H3" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h2>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-right max-w-xs">
        {value ?? "—"}
      </span>
    </div>
  );
}

function PersonCard({
  role,
  name,
  phone,
  avatar,
}: {
  role: string;
  name?: string;
  phone?: string;
  avatar?: string | null;
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xl font-bold shadow-sm">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
          {role}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {name ?? "—"}
        </p>
        <div className="flex items-center gap-1 mt-0.5 text-gray-400">
          <PhoneIcon />
          <p className="text-xs">{phone ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "bg-green-50 border-green-100"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-xl font-bold ${
          highlight ? "text-green-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function DriverPayoutHistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = (searchParams.get("type") ?? "rides") as
    | "rides"
    | "returns"
    | "shareVehicleBookings";

  const { data, isLoading } = useGetCompletedDriverPayouts({ limit: 100 });
  const [item, setItem] = useState<RidePayoutItem | null>(null);

  useEffect(() => {
    const list = data?.data?.result?.[type] ?? [];
    const found = list.find((i) => i._id === id);
    setItem((found as RidePayoutItem) ?? null);
  }, [data, id, type]);

  const getLocation = (item: RidePayoutItem) =>
    item.startLocation && item.endLocation
      ? { from: item.startLocation, to: item.endLocation }
      : { from: item.pickupStop ?? "—", to: item.dropStop ?? "—" };

  const getFare = (item: RidePayoutItem) => item.fare ?? item.totalFare ?? 0;
  const getPassengerOrUser = (item: RidePayoutItem) =>
    item.user ?? item.passenger ?? null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getFeatures = (): CarFeatures | null => {
    if (!item?.car?.features || typeof item.car.features !== "object")
      return null;
    return item.car.features as unknown as CarFeatures;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          <span>Loading payout details…</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Payout record not found.
      </div>
    );
  }

  const passengerOrUser = getPassengerOrUser(item);
  const fare = getFare(item);
  const serviceCharge = item.serviceCharge ?? 0;
  const driverReceives = fare - serviceCharge;
  const location = getLocation(item);

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 lg:p-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* ── Back + Title ── */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
            >
              <ArrowLeftIcon />
              Back to History
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Payout Detail
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">{item._id}</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
            <span className="text-green-500">
              <CheckCircleIcon />
            </span>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Paid Out
            </span>
          </div>
        </div>

        {/* ── Route banner ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">
              <MapPinIcon />
            </span>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="font-semibold text-gray-900 capitalize">
                {location.from}
              </span>
              <span className="text-gray-300 text-lg">→</span>
              <span className="font-semibold text-gray-900 capitalize">
                {location.to}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
              <div className="text-right">
                <p className="text-gray-400">Date</p>
                <p className="text-gray-700 font-medium">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── People ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PersonCard
            role="Driver"
            name={item.driver?.name}
            phone={item.driver?.phoneNumber}
            avatar={item.driver?.avatar}
          />
          <PersonCard
            role="Passenger"
            name={passengerOrUser?.name}
            phone={passengerOrUser?.phoneNumber}
            avatar={passengerOrUser?.avatar}
          />
        </div>

        {/* ── Financial summary ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total Fare" value={`৳${fare}`} />
          <StatCard
            label="Service Charge"
            value={`৳${serviceCharge}`}
            sub="Platform fee"
          />
          <StatCard
            label="Driver Receives"
            value={`৳${driverReceives}`}
            sub="After deduction"
            highlight
          />
        </div>

        {/* ── Ride Info ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHeader icon={<MapPinIcon />} title="Ride Information" />
          <DetailRow
            label="Status"
            value={
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {item.status}
              </span>
            }
          />
          <DetailRow
            label="Payment"
            value={
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                {item.payment}
              </span>
            }
          />
          <DetailRow
            label="OTP Verified"
            value={
              item.rideOtpVerified ? (
                <span className="text-green-600 font-semibold flex items-center gap-1 justify-end">
                  <CheckCircleIcon /> Verified
                </span>
              ) : (
                <span className="text-red-400">Not Verified</span>
              )
            }
          />
          <DetailRow label="Created" value={formatDate(item.createdAt)} />
          <DetailRow label="Last Updated" value={formatDate(item.updatedAt)} />
        </div>

        {/* ── Vehicle ── */}
        {item.car && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<CarIcon />} title="Vehicle" />

            {/* Car images */}
            {Array.isArray(getFeatures()?.images) && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {(getFeatures()?.images ?? []).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Car ${i + 1}`}
                    className="w-24 h-16 object-cover rounded-lg shrink-0 border border-gray-100"
                  />
                ))}
              </div>
            )}

            <DetailRow label="Name" value={item.car.carName} />
            <DetailRow label="Type" value={getFeatures()?.vehicleType} />
            <DetailRow label="Brand" value={getFeatures()?.brand} />
            <DetailRow label="Model" value={getFeatures()?.model} />
            <DetailRow label="Fuel" value={getFeatures()?.fuelType} />
            <DetailRow label="Gear" value={getFeatures()?.gearType} />
            <DetailRow label="Seats" value={getFeatures()?.seatCapacity} />
            <DetailRow label="Year" value={getFeatures()?.manufactureYear} />
          </div>
        )}

        {/* ── Payout status ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHeader icon={<WalletIcon />} title="Payout" />
          <DetailRow label="Fare" value={`৳${fare}`} />
          <DetailRow label="Service Charge" value={`-৳${serviceCharge}`} />
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-700">
              Driver Receives
            </span>
            <span className="text-lg font-bold text-green-700">
              ৳{driverReceives}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 bg-green-50 rounded-xl px-4 py-3">
            <span className="text-green-500">
              <CheckCircleIcon />
            </span>
            <span className="text-sm font-medium text-green-700">
              Payout completed successfully
            </span>
            <span className="ml-auto text-xs text-green-500">
              {formatDate(item.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
