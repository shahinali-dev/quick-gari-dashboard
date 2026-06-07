// pages/PaymentDetail.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApprovePayment,
  useGetPaymentById,
} from "@/hooks/payments/usePayments";

import { ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const paymentForLabels: Record<string, { label: string; className: string }> = {
  RIDE: { label: "Ride", className: "bg-blue-100 text-blue-800" },
  RETURN: { label: "Return", className: "bg-purple-100 text-purple-800" },
  SHARE_VEHICLE: {
    label: "Share Vehicle",
    className: "bg-amber-100 text-amber-800",
  },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

export default function PaymentDetail() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const { data: payment, isLoading } = useGetPaymentById(paymentId || null);
  const { mutate: approvePayment, isPending: isActioning } =
    useApprovePayment();

  const [actioningType, setActioningType] = useState<
    "approve" | "reject" | null
  >(null);

  const handleApprove = () => {
    if (!paymentId) return;
    setActioningType("approve");
    approvePayment(
      { paymentId, payload: { approved: true } },
      {
        onSuccess: () => {
          setActioningType(null);
          navigate("/payments");
        },
        onError: () => setActioningType(null),
      },
    );
  };

  const handleReject = () => {
    if (!paymentId) return;
    setActioningType("reject");
    approvePayment(
      {
        paymentId,
        payload: { approved: false, rejectionReason: "Rejected by admin" },
      },
      {
        onSuccess: () => {
          setActioningType(null);
          navigate("/payments");
        },
        onError: () => setActioningType(null),
      },
    );
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/payments")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────
  if (!payment) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/payments")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Payment not found</p>
        </div>
      </div>
    );
  }

  const typeInfo = paymentForLabels[payment.paymentFor] ?? {
    label: payment.paymentFor,
    className: "bg-gray-100 text-gray-800",
  };

  const isPending = payment.status === "PENDING";

  // ── Booking detail helpers ───────────────────────────────────────
  const ride = payment.rideId as Record<string, unknown> | null;
  const ret = payment.returnId as Record<string, unknown> | null;
  const share = payment.shareVehicleBookingId as Record<string, unknown> | null;

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/payments")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Payment Details
          </h1>
        </div>

        {/* Action buttons — only if still PENDING */}
        {isPending && (
          <div className="flex gap-2">
            <Button
              onClick={handleReject}
              disabled={isActioning}
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {actioningType === "reject" ? (
                <span className="text-xs">Rejecting...</span>
              ) : (
                <>
                  <X size={16} />
                  Reject
                </>
              )}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isActioning}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {actioningType === "approve" ? (
                <span className="text-xs">Approving...</span>
              ) : (
                <>
                  <Check size={16} />
                  Approve
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
        {/* ── Status ────────────────────────────────────────────── */}
        <div className="border-b pb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Status
          </h3>
          <div className="flex gap-2">
            <Badge className={typeInfo.className} variant="outline">
              {typeInfo.label}
            </Badge>
            <Badge
              className={
                payment.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : payment.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {payment.status}
            </Badge>
          </div>
        </div>

        {/* ── User Information ──────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Name" value={payment.userId?.name ?? "—"} />
            <InfoRow label="Phone" value={payment.userId?.phoneNumber ?? "—"} />
          </div>
        </div>

        {/* ── Payment Information ───────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Transaction ID"
              value={
                <span className="font-mono text-gray-700">
                  {payment.transactionId}
                </span>
              }
            />
            <InfoRow
              label="Payment Method"
              value={
                <span className="capitalize">{payment.paymentMethod}</span>
              }
            />
            <InfoRow
              label="Amount"
              value={
                payment.amount > 0 ? (
                  <span className="text-gray-900 font-semibold">
                    ৳{payment.amount}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )
              }
            />
            <InfoRow
              label="Submitted At"
              value={new Date(payment.submittedAt).toLocaleString("en-BD", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            />
          </div>
        </div>

        {/* ── Ride Booking Detail ───────────────────────────────── */}
        {ride && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ride Booking Detail
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="From"
                value={(ride.startLocation as string) ?? "—"}
              />
              <InfoRow label="To" value={(ride.endLocation as string) ?? "—"} />
              <InfoRow
                label="Date"
                value={
                  ride.date
                    ? new Date(ride.date as string).toLocaleDateString(
                        "en-BD",
                        { dateStyle: "medium" },
                      )
                    : "—"
                }
              />
              <InfoRow label="Fare" value={ride.fare ? `৳${ride.fare}` : "—"} />
              <InfoRow
                label="Status"
                value={
                  <Badge variant="outline" className="capitalize">
                    {(ride.status as string) ?? "—"}
                  </Badge>
                }
              />
              <InfoRow
                label="Payment"
                value={(ride.payment as string) ?? "—"}
              />
            </div>
          </div>
        )}

        {/* ── Return Booking Detail ─────────────────────────────── */}
        {ret && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Return Booking Detail
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="From"
                value={(ret.startLocation as string) ?? "—"}
              />
              <InfoRow label="To" value={(ret.endLocation as string) ?? "—"} />
              <InfoRow
                label="Date"
                value={
                  ret.date
                    ? new Date(ret.date as string).toLocaleDateString("en-BD", {
                        dateStyle: "medium",
                      })
                    : "—"
                }
              />
              <InfoRow label="Fare" value={ret.fare ? `৳${ret.fare}` : "—"} />
              <InfoRow
                label="Status"
                value={
                  <Badge variant="outline" className="capitalize">
                    {(ret.status as string) ?? "—"}
                  </Badge>
                }
              />
              <InfoRow label="Payment" value={(ret.payment as string) ?? "—"} />
            </div>
          </div>
        )}

        {/* ── Share Vehicle Booking Detail ──────────────────────── */}
        {share && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Vehicle Booking Detail
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const passenger = share.passenger as
                  | Record<string, unknown>
                  | undefined;
                return (
                  <>
                    <InfoRow
                      label="Passenger"
                      value={(passenger?.name as string) ?? "—"}
                    />
                    <InfoRow
                      label="Phone"
                      value={(passenger?.phoneNumber as string) ?? "—"}
                    />
                  </>
                );
              })()}
              <InfoRow
                label="Pickup Stop"
                value={(share.pickupStop as string) ?? "—"}
              />
              <InfoRow
                label="Drop Stop"
                value={(share.dropStop as string) ?? "—"}
              />
              <InfoRow
                label="Seats Booked"
                value={(share.seatsBooked as number) ?? "—"}
              />
              <InfoRow
                label="Per Seat Fare"
                value={share.perSeatFare ? `৳${share.perSeatFare}` : "—"}
              />
              <InfoRow
                label="Total Fare"
                value={share.totalFare ? `৳${share.totalFare}` : "—"}
              />
              <InfoRow
                label="Total Price"
                value={share.totalPrice ? `৳${share.totalPrice}` : "—"}
              />
              <InfoRow
                label="Journey Start"
                value={
                  share.journeyStartedAt
                    ? new Date(share.journeyStartedAt as string).toLocaleString(
                        "en-BD",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )
                    : "—"
                }
              />
              <InfoRow
                label="Status"
                value={
                  <Badge variant="outline" className="capitalize">
                    {(share.status as string) ?? "—"}
                  </Badge>
                }
              />
            </div>
          </div>
        )}

        {/* ── Timestamps ────────────────────────────────────────── */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p className="font-semibold">Created</p>
              <p>
                {new Date(payment.createdAt).toLocaleString("en-BD", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Last Updated</p>
              <p>
                {new Date(payment.updatedAt).toLocaleString("en-BD", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
