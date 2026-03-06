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
import { Check, Eye } from "lucide-react";

interface CarRegistrationRequest {
  _id: string;
  carName: string;
  user: {
    name: string;
    email: string;
  };
  vehicleRegistration: {
    registrationNumber: string;
  };
  isApproved: boolean;
}

interface CarRegistrationTableProps {
  requests: CarRegistrationRequest[];
  isLoading?: boolean;
  isApproving?: boolean;
  approvingId?: string | null;
  onView?: (requestId: string) => void;
  onApprove?: (requestId: string) => void;
}

export default function CarRegistrationTable({
  requests,
  isLoading = false,
  isApproving = false,
  approvingId = null,
  onView,
  onApprove,
}: CarRegistrationTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Registration #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No car registration requests found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Car Name</TableHead>
            <TableHead className="font-semibold">User Name</TableHead>
            <TableHead className="font-semibold">User Email</TableHead>
            <TableHead className="font-semibold">Registration #</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{request.carName}</TableCell>
              <TableCell className="text-gray-600">
                {request.user.name}
              </TableCell>
              <TableCell className="text-gray-600">
                {request.user.email}
              </TableCell>
              <TableCell className="text-gray-600">
                {request.vehicleRegistration.registrationNumber}
              </TableCell>
              <TableCell>
                <Badge
                  variant={request.isApproved ? "default" : "secondary"}
                  className={
                    request.isApproved
                      ? "bg-green-100 text-green-900"
                      : "bg-yellow-100 text-yellow-900"
                  }
                >
                  {request.isApproved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView?.(request._id)}
                    title="View details"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye size={16} />
                  </Button>
                  {!request.isApproved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove?.(request._id)}
                      disabled={isApproving && approvingId === request._id}
                      title="Approve request"
                      className="text-green-600 hover:text-green-900 hover:bg-green-50"
                    >
                      {isApproving && approvingId === request._id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <Check size={16} />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
