import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "@/layouts/RootLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Rides from "@/pages/Rides";
import Users from "@/pages/Users";
import UserDetail from "@/pages/UserDetail";
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
    ],
  },
]);

export default router;
