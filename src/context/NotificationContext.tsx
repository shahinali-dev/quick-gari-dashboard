import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export interface AppNotification {
  id: string;
  type: "CAR_REGISTRATION" | "OTHER";
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
  clearNotifications: () => void;
  isConnected: boolean;
}

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

  useEffect(() => {
    // Initialize socket connection
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socketUrl = apiUrl.replace("/api", "");

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to notification server");
      setIsConnected(true);

      // Get user ID from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        newSocket.emit("user:connect", user._id || user.id);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from notification server");
      setIsConnected(false);
    });

    // Listen for car registration notifications
    newSocket.on("NEW_CAR_REGISTRATION", (data: any) => {
      console.log("📬 New car registration notification:", data);
      addNotification({
        type: "CAR_REGISTRATION",
        title: "New Car Registration Request",
        message: data.message || `${data.userName} registered a new car`,
        data: data,
        actionUrl: `/car-registration/${data.carRegistrationId}`,
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addNotification = (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50

    // Auto-remove after 5 seconds if not interacted
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id),
      );
    }, 5000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearNotifications,
        isConnected,
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
