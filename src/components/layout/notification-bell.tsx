import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BiBell } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications with performance optimization
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 60000, // Refetch every 60 seconds instead of 30
    staleTime: 30000, // Cache for 30 seconds
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    refetchInterval: 60000, // Refetch every 60 seconds instead of 30
    staleTime: 30000, // Cache for 30 seconds
    enabled: isOpen, // Only fetch when dropdown is open
  });

  const markAsReadMutation = useMutation({
  mutationFn: (id: number) =>
    apiRequest(`/api/notifications/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({}),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
  },
});

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-green-100 text-green-800";
      case "appointment":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatNotificationType = (type: string) => {
    // Convert underscore/snake_case to Title Case
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const unreadCount = (unreadData as any)?.count || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <BiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {!(notifications as any[])?.length ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-1">
                  {(notifications as any[])?.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {notification.createdAt && format(new Date(notification.createdAt), "MMM d, h:mm a")}
                            </p>
                            <div className="flex items-center space-x-2">
                              {notification.type && (
                                <Badge 
                                  className={`text-xs border-0 px-2 py-1 shrink-0 ${getTypeColor(notification.type)}`}
                                >
                                  {formatNotificationType(notification.type)}
                                </Badge>
                              )}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}