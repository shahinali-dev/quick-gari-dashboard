import type {
  AppNotification,
  NotificationType,
} from "@/context/NotificationContext";
import { api } from "@/lib/api";
import { useCallback, useState } from "react";

const NOTIFICATION_TITLES: Record<string, string> = {
  RIDE_REQUEST: "New Ride Request",
  PAYMENT_SUBMITTED: "Payment Submitted",
  CAR_REGISTRATION: "New Car Registration",
  RIDE_ACCEPTED: "Ride Accepted",
  PAYMENT_VERIFIED: "Payment Verified",
  OTHER: "Notification",
};

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

interface UseNotificationsFetchResult {
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNotificationsFetch(): UseNotificationsFetchResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/notifications");
      if (response.data?.data) {
        const serverNotifications: AppNotification[] = (
          response.data.data || []
        ).map((notif: any) => ({
          _id: notif._id,
          id: notif._id,
          type: (notif.type || "OTHER") as NotificationType,
          title:
            NOTIFICATION_TITLES[notif.type as NotificationType] ||
            "Notification",
          message: notif.message,
          data: notif,
          timestamp: new Date(notif.createdAt),
          read: notif.isRead,
          actionUrl: getActionUrl(
            notif.type as NotificationType,
            notif.metadata?.refs || {},
          ),
        }));
        setNotifications(serverNotifications);
      }
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchNotifications,
  };
}
