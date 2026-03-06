import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllCarRegistrationRequest,
  useApproveCarRegistrationRequest,
  type CarRegistrationRequest,
} from "@/hooks";
import { useState } from "react";

export default function CarRegistrationDetail() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Fetch all requests and find the one by ID
  const { data } = useGetAllCarRegistrationRequest({
    limit: 100,
  });
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveCarRegistrationRequest();

  const carRequest = data?.data.find((req) => req._id === requestId);
  const isLoading = !carRequest && data === undefined;

  const handleApprove = () => {
    if (!carRequest) return;
    setApprovingId(carRequest._id);
    approveRequest(carRequest._id, {
      onSuccess: () => {
        setApprovingId(null);
        navigate("/car-registration");
      },
      onError: () => {
        setApprovingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/car-registration")}
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

  if (!carRequest) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/car-registration")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Car registration request not found</p>
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
          onClick={() => navigate("/car-registration")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Car Registration Details
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Status Section */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Status
              </h3>
              <Badge
                className={
                  carRequest.isApproved
                    ? "bg-green-100 text-green-900"
                    : "bg-yellow-100 text-yellow-900"
                }
              >
                {carRequest.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* User Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.user.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.user.email}
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
                  {carRequest.carName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Vehicle Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.vehicleType}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Brand
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.brand}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Model
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.model}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Manufacture Year
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.manufactureYear}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Seat Capacity
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.seatCapacity} Seats
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Fuel Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.fuelType}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Gear Type
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.features.gearType}
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
                  {carRequest.vehicleRegistration.registrationNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Registration (Years)
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {carRequest.vehicleRegistration.registration} years
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Tax Token Photo
                </p>
                <img
                  src={carRequest.vehicleRegistration.taxTokenPhoto}
                  alt="Tax Token"
                  className="max-w-xs h-auto rounded border border-gray-200"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Registration Card Photo
                </p>
                <img
                  src={carRequest.vehicleRegistration.registrationCardPhoto}
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
              src={carRequest.drivingLicensePhoto}
              alt="Driving License"
              className="max-w-xs h-auto rounded border border-gray-200"
            />
          </div>

          {/* Car Images */}
          {carRequest.features.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Car Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {carRequest.features.images.map((image, index) => (
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
                  {new Date(carRequest.createdAt).toLocaleDateString("en-US", {
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
                  {new Date(carRequest.updatedAt).toLocaleDateString("en-US", {
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

          {/* Approve Button */}
          {!carRequest.isApproved && (
            <div className="border-t pt-4">
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isApproving ? "Approving..." : "Approve Registration"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
