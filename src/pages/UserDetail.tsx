import { useGetUserById } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: userData, isLoading } = useGetUserById(userId || null);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-100 text-amber-900";
      case "car_owner":
        return "bg-blue-100 text-blue-900";
      case "user":
        return "bg-green-100 text-green-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "car_owner":
        return "Car Owner";
      case "user":
        return "User";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/users")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
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

  if (!userData) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/users")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">User not found</p>
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
          onClick={() => navigate("/users")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          User Details
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Name
              </p>
              <p className="text-lg font-medium text-gray-900">
                {userData.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Email
              </p>
              <p className="text-lg font-medium text-gray-900">
                {userData.email}
              </p>
            </div>
          </div>

          {/* Phone and Role Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Phone Number
              </p>
              <p className="text-lg font-medium text-gray-900">
                {userData.phoneNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Role
              </p>
              <Badge className={`${getRoleBadgeColor(userData.role)} text-xs font-semibold`}>
                {getRoleLabel(userData.role)}
              </Badge>
            </div>
          </div>

          {/* Verification Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Verification Status
              </p>
              <Badge
                variant="outline"
                className={
                  userData.isVerified
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {userData.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Car Owner
              </p>
              <Badge
                variant="outline"
                className={
                  userData.isCarOwner
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {userData.isCarOwner ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Join Date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Join Date
            </p>
            <p className="text-lg font-medium text-gray-900">
              {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>

          {/* ID */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              User ID
            </p>
            <p className="text-sm font-mono text-gray-600 break-all">
              {userData._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
