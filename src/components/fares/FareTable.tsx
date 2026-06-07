// components/fares/FareTable.tsx
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
import type { ShareVehicleFare } from "@/hooks/shareVehicleFare/useShareVehicleFare";

import { Pencil, Trash2 } from "lucide-react";

interface FareTableProps {
  fares: ShareVehicleFare[];
  isLoading?: boolean;
  deletingId?: string | null;
  onEdit?: (fare: ShareVehicleFare) => void;
  onDelete?: (fareId: string) => void;
}

export default function FareTable({
  fares,
  isLoading = false,
  deletingId = null,
  onEdit,
  onDelete,
}: FareTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {["From", "To", "Per Seat Fare", "Status", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(5)].map((_, j) => (
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

  if (!fares.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">No fare configurations found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">From</TableHead>
            <TableHead className="font-semibold">To</TableHead>
            <TableHead className="font-semibold">Per Seat Fare</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fares.map((fare) => (
            <TableRow key={fare._id} className="hover:bg-gray-50">
              <TableCell className="font-medium capitalize">
                {fare.fromLocation}
              </TableCell>
              <TableCell className="text-gray-600 capitalize">
                {fare.toLocation}
              </TableCell>
              <TableCell className="font-semibold text-gray-900">
                ৳{fare.perSeatFare}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    fare.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }
                  variant="outline"
                >
                  {fare.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(fare)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit fare"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(fare._id)}
                    disabled={deletingId === fare._id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete fare"
                  >
                    {deletingId === fare._id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
