import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "@/layouts/RootLayout";
import CarDetail from "@/pages/CarDetail";
import CarRegistration from "@/pages/CarRegistration";
import CarRegistrationDetail from "@/pages/CarRegistrationDetail";
import Cars from "@/pages/Cars";
import Dashboard from "@/pages/Dashboard";
import DriverPayoutHistory from "@/pages/DriverPayoutHistory";
import DriverPayoutHistoryDetail from "@/pages/DriverPayoutHistoryDetail";
import DriverPayouts from "@/pages/DriverPayouts";
import Login from "@/pages/Login";
import Notifications from "@/pages/Notifications";
import PaymentDetail from "@/pages/PaymentDetail";
import PaymentRequests from "@/pages/PaymentRequests";
import Rides from "@/pages/Rides";
import ShareVehicleFares from "@/pages/ShareVehicleFares";
import UserDetail from "@/pages/UserDetail";
import Users from "@/pages/Users";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:userId",
        element: <UserDetail />,
      },
      {
        path: "/rides",
        element: <Rides />,
      },
      {
        path: "/cars",
        element: <Cars />,
      },
      {
        path: "/cars/:carId",
        element: <CarDetail />,
      },
      {
        path: "/car-registration",
        element: <CarRegistration />,
      },
      {
        path: "/car-registration/:requestId",
        element: <CarRegistrationDetail />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/payments",
        element: <PaymentRequests />,
      },
      {
        path: "/payments/:paymentId",
        element: <PaymentDetail />,
      },
      {
        path: "/share-vehicle-fares",
        element: <ShareVehicleFares />,
      },
      {
        path: "/driver-payout",
        element: <DriverPayouts />,
      },
      {
        path: "/driver-payout-history",
        element: <DriverPayoutHistory />,
      },
      {
        path: "/driver-payout-history/:id",
        element: <DriverPayoutHistoryDetail />,
      },
    ],
  },
]);

export default router;
