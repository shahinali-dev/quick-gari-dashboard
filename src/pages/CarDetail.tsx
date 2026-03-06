import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCarById } from "@/hooks";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CarDetail() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();

  const { data: carData, isLoading } = useGetCarById(carId || null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cars")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cars")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cars")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Car Details
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Status Section */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Approval Status
              </h3>
              <Badge
                className={
                  carData.isApproved
                    ? "bg-green-100 text-green-900"
                    : "bg-yellow-100 text-yellow-900"
                }
              >
                {carData.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Owner Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.user.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Car Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Car Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.carName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Vehicle Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.vehicleType}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Brand
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.brand}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Model
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.model}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Manufacture Year
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.manufactureYear}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Seat Capacity
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.seatCapacity} Seats
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Fuel Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.fuelType}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Gear Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.features.gearType}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Registration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vehicle Registration
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Registration Number
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.vehicleRegistration.registrationNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Registration (Years)
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carData.vehicleRegistration.registration} years
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Tax Token Photo
                </p>
                <img
                  src={carData.vehicleRegistration.taxTokenPhoto}
                  alt="Tax Token"
                  className="max-w-xs h-auto rounded border border-gray-200"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Registration Card Photo
                </p>
                <img
                  src={carData.vehicleRegistration.registrationCardPhoto}
                  alt="Registration Card"
                  className="max-w-xs h-auto rounded border border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Driving License Photo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Driving License Photo
            </h3>
            <img
              src={carData.drivingLicensePhoto}
              alt="Driving License"
              className="max-w-xs h-auto rounded border border-gray-200"
            />
          </div>

          {/* Car Images */}
          {carData.features.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Car Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {carData.features.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Car ${index + 1}`}
                    className="w-full h-32 object-cover rounded border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <p className="font-semibold">Created</p>
                <p>
                  {new Date(carData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="font-semibold">Last Updated</p>
                <p>
                  {new Date(carData.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
