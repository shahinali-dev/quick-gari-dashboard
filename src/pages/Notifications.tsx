import { Button } from "@/components/ui/button";
import {
  useNotifications,
  type AppNotification,
} from "@/context/NotificationContext";
import { useNotificationsFetch } from "@/hooks";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const { markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const { notifications, isLoading, error, refetch } = useNotificationsFetch();
  const [isMarking, setIsMarking] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications when page mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleNotificationClick = useCallback(
    (notification: AppNotification) => {
      markAsRead(notification.id);
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    },
    [markAsRead, navigate],
  );

  const handleMarkAllAsRead = async () => {
    setIsMarking(true);
    try {
      await markAllAsRead();
      await refetch();
    } finally {
      setIsMarking(false);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {notifications.length} total • {unreadNotifications.length} unread
          </p>
        </div>
        <div className="flex gap-2">
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarking}
              className="gap-2"
            >
              <CheckCheck size={16} />
              {isMarking ? "Marking..." : "Mark all as read"}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearNotifications}
              className="gap-2"
            >
              <Trash2 size={16} />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium mt-4">
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell size={48} className="text-red-300 mb-4" />
            <p className="text-gray-500 font-medium">
              Failed to load notifications
            </p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              You'll see notifications here when something happens
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        {new Date(notification.timestamp).toLocaleDateString()}{" "}
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="whitespace-nowrap"
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      {notifications.length > 0 && !isLoading && (
        <div className="text-center text-sm text-gray-500">
          <p>Showing {notifications.length} notifications</p>
        </div>
      )}
    </div>
  );
}
