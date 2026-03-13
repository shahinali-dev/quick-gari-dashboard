/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, clearNotifications } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const displayedNotifications = notifications.slice(0, 5);
  const hasMore = notifications.length > 5;

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              displayedNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer with View All and Clear */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 flex gap-2 justify-between">
              {hasMore && (
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setIsOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all ({notifications.length})
                </button>
              )}
              <button
                onClick={() => {
                  clearNotifications();
                  setIsOpen(false);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
