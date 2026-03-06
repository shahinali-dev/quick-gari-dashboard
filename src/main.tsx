import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/provider/AuthProvider";
import { QueryProvider } from "@/provider/QueryProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
