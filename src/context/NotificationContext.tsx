/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export type NotificationType =
  | "RIDE_REQUEST"
  | "PAYMENT_SUBMITTED"
  | "CAR_REGISTRATION"
  | "RIDE_ACCEPTED"
  | "PAYMENT_VERIFIED"
  | "OTHER";

export interface AppNotification {
  _id?: string;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: any;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

// type অনুযায়ী title map
const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  RIDE_REQUEST: "New Ride Request",
  PAYMENT_SUBMITTED: "Payment Submitted",
  CAR_REGISTRATION: "New Car Registration",
  RIDE_ACCEPTED: "Ride Accepted",
  PAYMENT_VERIFIED: "Payment Verified",
  OTHER: "Notification",
};

// type অনুযায়ী actionUrl map
const getActionUrl = (
  type: NotificationType,
  refs: any,
): string | undefined => {
  switch (type) {
    case "CAR_REGISTRATION":
      return refs?.carId ? `/car-registration/${refs.carId}` : undefined;
    case "RIDE_REQUEST":
    case "RIDE_ACCEPTED":
      return refs?.rideId ? `/rides/${refs.rideId}` : undefined;
    case "PAYMENT_SUBMITTED":
    case "PAYMENT_VERIFIED":
      return refs?.paymentId ? `/payments/${refs.paymentId}` : undefined;
    default:
      return undefined;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // addNotification কে useEffect এর বাইরে রাখো — stable reference দরকার
  const addNotification = (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id || n._id === id) {
          // Optimistically update UI
          if (n._id) {
            api
              .patch(`/api/v1/notifications/mark-as-read/${n._id}`)
              .catch((error) => {
                console.error("Failed to mark as read:", error);
              });
          }
          return { ...n, read: true };
        }
        return n;
      }),
    );
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/v1/notifications/mark-all-as-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const clearNotifications = () => setNotifications([]);

  // Initialize socket only - NO automatic API fetch
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socketUrl = apiUrl.replace("/api", "");

    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to notification server");
      setIsConnected(true);
      setIsLoading(false);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // ✅ role সহ পাঠাও
          socket.emit("user:connect", {
            userId: user._id || user.id,
            role: user.role, // "admin" | "user"
          });
        } catch {
          console.error("Failed to parse user from localStorage");
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from notification server");
      setIsConnected(false);
    });

    // ✅ সব notification এক জায়গায় handle
    socket.on("notification:new", (data: any) => {
      console.log("📬 New notification:", data);

      const type: NotificationType = data.type || "OTHER";

      addNotification({
        type,
        title: NOTIFICATION_TITLES[type] || "Notification",
        message: data.message,
        data: data,
        actionUrl: getActionUrl(type, data.refs || data.metadata?.refs),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        isConnected,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}
