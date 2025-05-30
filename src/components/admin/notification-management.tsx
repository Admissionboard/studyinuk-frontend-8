import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Send, 
  Bell, 
  Users, 
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  X
} from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";

interface NotificationForm {
  title: string;
  message: string;
  type: string;
  userIds: string[];
  sendToAll: boolean;
}

interface SelectedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function NotificationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NotificationForm>({
    title: "",
    message: "",
    type: "info",
    userIds: [],
    sendToAll: true
  });

  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

  // Fetch all users for targeting
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/notifications", data),
    onSuccess: (response: any) => {
      toast({
        title: "Notification Sent Successfully!",
        description: response.message,
      });
      // Reset form
      setForm({
        title: "",
        message: "",
        type: "info",
        userIds: [],
        sendToAll: true
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.message.trim()) {
      toast({
        title: "Error",
        description: "Title and message are required.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      userIds: form.sendToAll ? [] : form.userIds
    };

    sendNotificationMutation.mutate(payload);
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    if (!userSearch.trim()) return false;
    const searchLower = userSearch.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const firstName = user.firstName?.toLowerCase() || "";
    const lastName = user.lastName?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    return email.includes(searchLower) || 
           firstName.includes(searchLower) || 
           lastName.includes(searchLower) ||
           fullName.includes(searchLower);
  });

  // Add user to selection
  const addUser = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      const newUser: SelectedUser = {
        id: user.id,
        email: user.email || "",
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      };
      setSelectedUsers(prev => [...prev, newUser]);
      setForm(prev => ({
        ...prev,
        userIds: [...prev.userIds, user.id]
      }));
    }
    setUserSearch("");
  };

  // Remove user from selection
  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    setForm(prev => ({
      ...prev,
      userIds: prev.userIds.filter(id => id !== userId)
    }));
  };

  // Clear all selections when switching to "Send to All"
  const handleSendToAllChange = (sendToAll: boolean) => {
    setForm(prev => ({ ...prev, sendToAll, userIds: [] }));
    setSelectedUsers([]);
    setUserSearch("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "appointment":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "critical":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-green-50 text-green-700 border-green-200";
      case "appointment":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-slate-900">Send Notification</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notification Title *
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title..."
                className="w-full"
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your notification message..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notification Type
              </label>
              <Select 
                value={form.type} 
                onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>Information</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="application">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Application</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="appointment">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span>Appointment</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Critical</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Users */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Send To
              </label>
              
              <div className="space-y-3">
                {/* Send to All Users Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendToAll"
                    checked={form.sendToAll}
                    onCheckedChange={(checked) => setForm(prev => ({ 
                      ...prev, 
                      sendToAll: checked as boolean,
                      userIds: checked ? [] : prev.userIds
                    }))}
                  />
                  <label htmlFor="sendToAll" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Send to All Users ({users.length} users)</span>
                  </label>
                </div>

                {/* Individual User Selection with Search */}
                {!form.sendToAll && (
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Search Results */}
                    {userSearch && (
                      <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          <div className="p-2">
                            {filteredUsers.slice(0, 10).map((user) => (
                              <button
                                key={user.id}
                                onClick={() => addUser(user)}
                                className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center justify-between group"
                                disabled={selectedUsers.some(u => u.id === user.id)}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-slate-900">
                                    {user.firstName && user.lastName 
                                      ? `${user.firstName} ${user.lastName}` 
                                      : user.email}
                                  </div>
                                  <div className="text-sm text-slate-500 truncate">{user.email}</div>
                                </div>
                                <div className="text-xs text-slate-400 group-hover:text-slate-600">
                                  {selectedUsers.some(u => u.id === user.id) ? "Selected" : "Click to add"}
                                </div>
                              </button>
                            ))}
                            {filteredUsers.length > 10 && (
                              <div className="text-xs text-slate-500 p-2 border-t">
                                Showing first 10 results. Refine your search for more specific results.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500">
                            No users found matching "{userSearch}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                      <div className="border border-slate-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-slate-700 mb-2">
                          Selected users ({selectedUsers.length}):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                            >
                              <span>
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.email}
                              </span>
                              <button
                                onClick={() => removeUser(user.id)}
                                className="ml-1 hover:bg-blue-100 rounded p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="text-sm font-medium text-slate-700 mb-2">Preview:</div>
                <div className={`border rounded-lg p-3 ${getTypeColor(form.type)}`}>
                  <div className="flex items-start space-x-2">
                    {getTypeIcon(form.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{form.title || "Notification Title"}</div>
                      <div className="text-sm mt-1">{form.message || "Notification message..."}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                {form.sendToAll 
                  ? `Sending to all ${users.length} users` 
                  : `Sending to ${selectedUsers.length} selected users`
                }
              </div>
              <Button
                type="submit"
                disabled={sendNotificationMutation.isPending || !form.title.trim() || !form.message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {sendNotificationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setForm(prev => ({
                ...prev,
                title: "Application Status Update",
                message: "Your application has been reviewed and updated. Please check your application status for the latest information.",
                type: "application"
              }))}
            >
              <div>
                <div className="font-medium">Application Update</div>
                <div className="text-sm text-slate-500">Notify about application progress</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setForm(prev => ({
                ...prev,
                title: "Appointment Scheduled",
                message: "Your counseling appointment has been scheduled for [DATE] at [TIME]. Please be available for the consultation.",
                type: "appointment"
              }))}
            >
              <div>
                <div className="font-medium">Appointment Notice</div>
                <div className="text-sm text-slate-500">Schedule counseling appointments</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setForm(prev => ({
                ...prev,
                title: "Urgent: Document Required",
                message: "URGENT: Missing documents required for your application. Please submit immediately to avoid delays.",
                type: "critical"
              }))}
            >
              <div>
                <div className="font-medium">Critical Alert</div>
                <div className="text-sm text-slate-500">Send urgent notifications</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setForm(prev => ({
                ...prev,
                title: "New Course Available",
                message: "We've added new courses to our database. Check out the latest opportunities and add them to your favorites!",
                type: "info"
              }))}
            >
              <div>
                <div className="font-medium">General Information</div>
                <div className="text-sm text-slate-500">Share general updates</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}