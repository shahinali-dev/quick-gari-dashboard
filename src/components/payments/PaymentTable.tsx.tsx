// components/payments/PaymentTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PendingPayment } from "@/hooks/payments/usePayments";

import { Check, Eye, X } from "lucide-react";

interface PaymentTableProps {
  payments: PendingPayment[];
  isLoading?: boolean;
  approvingId?: string | null;
  rejectingId?: string | null;
  onView?: (paymentId: string) => void;
  onApprove?: (paymentId: string) => void;
  onReject?: (paymentId: string) => void;
}

const paymentForLabels: Record<string, { label: string; className: string }> = {
  RIDE: { label: "Ride", className: "bg-blue-100 text-blue-800" },
  RETURN: { label: "Return", className: "bg-purple-100 text-purple-800" },
  SHARE_VEHICLE: {
    label: "Share Vehicle",
    className: "bg-amber-100 text-amber-800",
  },
};

export default function PaymentTable({
  payments,
  isLoading = false,
  approvingId = null,
  rejectingId = null,
  onView,
  onApprove,
  onReject,
}: PaymentTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "User",
                "Phone",
                "Type",
                "Method",
                "Amount",
                "Transaction ID",
                "Submitted At",
                "Actions",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">
          No pending payment requests found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Method</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Transaction ID</TableHead>
            <TableHead className="font-semibold">Submitted At</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const typeInfo = paymentForLabels[payment.paymentFor] ?? {
              label: payment.paymentFor,
              className: "bg-gray-100 text-gray-800",
            };
            const isActioning =
              approvingId === payment._id || rejectingId === payment._id;

            return (
              <TableRow key={payment._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {payment.userId?.name ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {payment.userId?.phoneNumber ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge className={typeInfo.className} variant="outline">
                    {typeInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 capitalize">
                  {payment.paymentMethod}
                </TableCell>
                <TableCell className="font-medium">
                  {payment.amount > 0 ? (
                    `৳${payment.amount}`
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-500 text-xs font-mono">
                  {payment.transactionId}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(payment.submittedAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(payment._id)}
                      title="View details"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove?.(payment._id)}
                      disabled={isActioning}
                      title="Approve payment"
                      className="text-green-600 hover:text-green-900 hover:bg-green-50"
                    >
                      {approvingId === payment._id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <Check size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject?.(payment._id)}
                      disabled={isActioning}
                      title="Reject payment"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {rejectingId === payment._id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <X size={16} />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
