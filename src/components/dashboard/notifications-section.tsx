import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BiBell } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import type { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function NotificationsSection({ onBellClick }: { onBellClick?: () => void }) {
  const queryClient = useQueryClient();
  const [audio] = useState(() => {
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkeCC2F0PLWgToFHm7A7+OZQQ0PVqHo6q5hGQU8lNri0nUhBSiN1/LPeC0FJHfE7N2OQAoTXbLp6qpWFApGneDyvWkeBS6Dy/LXgzsGHW3A7eSaQAw6vqMAgAaEhOZGrk1zYdCdpoBXpdhqJgX/jU/WlOqLQpKJhOQIQwPVPQ6IrUqhRTrjq9N8lGZPiYeDHK4kKVi4n85mqjELAoFrOIAGhITmRq5Nc2HQnaaAV6XYaiYF/41P1pTqi0KSiYTkCEMD1T0OiK1KoUU646vTfJRmT4mHgxyuJClYuJ/OZqoxCwKBaziABoSE5kauTXNh0J2mgFel2GomBf+NT9aU6otCkomE5AhDA9U9DoitSqFFOuOr03yUZk+Jh4McriQpWLifzmasMQsCgWs4gAaEhOZGrk1zYdCdpoBXpdhqJgX/jU/WlOqLQpKJhOQIQwPVPQ6IrUqhRTrjq9N8lGZPiYeDHK4kKVi4n85mqjELAoFrOIAGhITmRq5Nc2HQnaaAV6XYaiYF/41P1pTqi0KSiYTkCEMD1T0OiK1KoUU646vTfJRmT4mHgxyuJClYuJ/OZqoxCwKBazh=";
    return audio;
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
  });

  const unreadCount = unreadData?.count || 0;

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  // Removed automatic notification sound

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-l-green-500";
      case "warning":
        return "bg-yellow-50 border-l-yellow-500";
      case "error":
        return "bg-red-50 border-l-red-500";
      default:
        return "bg-blue-50 border-l-blue-500";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  return (
    <>
      {/* Notification Bell (for header) */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => {
          if (onBellClick) {
            onBellClick();
          }
          if (unreadCount > 0) {
            audio.play().catch(() => {});
          }
        }}
      >
        <BiBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Card (for dashboard) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-sm text-red-500 font-normal">
                {unreadCount} unread
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-l-4 cursor-pointer transition-colors",
                    getTypeColor(notification.type),
                    notification.isRead 
                      ? "bg-gray-100 border-gray-300" 
                      : "bg-red-50 border-red-400 ring-2 ring-red-200 shadow-md"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    notification.type === "success" ? "bg-green-500" :
                    notification.type === "warning" ? "bg-yellow-500" :
                    notification.type === "error" ? "bg-red-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1">
                    <p className={cn(
                      notification.isRead 
                        ? "text-gray-600 font-normal" 
                        : "text-gray-900 font-bold"
                    )}>
                      {notification.message}
                    </p>
                    <p className={cn(
                      "text-sm mt-1",
                      notification.isRead ? "text-gray-400" : "text-gray-700 font-medium"
                    )}>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No notifications yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
