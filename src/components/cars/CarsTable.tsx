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
import type { Car } from "@/hooks";
import { Eye } from "lucide-react";

interface CarsTableProps {
  cars: Car[];
  isLoading?: boolean;
  onView?: (carId: string) => void;
}

export default function CarsTable({
  cars,
  isLoading = false,
  onView,
}: CarsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car Name</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
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
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No cars found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Car Name</TableHead>
            <TableHead className="font-semibold">Owner Name</TableHead>
            <TableHead className="font-semibold">Brand</TableHead>
            <TableHead className="font-semibold">Model</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{car.carName}</TableCell>
              <TableCell className="text-gray-600">{car.user.name}</TableCell>
              <TableCell className="text-gray-600">
                {car.features.brand}
              </TableCell>
              <TableCell className="text-gray-600">
                {car.features.model}
              </TableCell>
              <TableCell>
                <Badge
                  variant={car.isApproved ? "default" : "secondary"}
                  className={
                    car.isApproved
                      ? "bg-green-100 text-green-900"
                      : "bg-yellow-100 text-yellow-900"
                  }
                >
                  {car.isApproved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(car._id)}
                  title="View details"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Eye size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
