import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Eye, 
  Mail, 
  Phone,
  Calendar,
  GraduationCap,
  Heart,
  FileText
} from "@/lib/icons";
import type { User } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users", searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const url = `/api/admin/users${params.toString() ? '?' + params.toString() : ''}`;
      return fetch(url, { credentials: "include" }).then(res => res.json());
    },
  });

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">View and manage all registered users</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'recently'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

// User Detail Modal Component
function UserDetailModal({ user, isOpen, onClose }: { user: User; isOpen: boolean; onClose: () => void }) {
  // Fetch user's detailed data
  const { data: userDetails } = useQuery({
    queryKey: ["/api/admin/users", user.id, "details"],
    queryFn: () => fetch(`/api/admin/users/${user.id}/details`, { credentials: "include" }).then(res => res.json()),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>{user.firstName} {user.lastName}</div>
              <div className="text-sm font-normal text-gray-600">{user.email}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="mt-1">
                    <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-green-100 text-green-800" : ""}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Member Since</div>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact User
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userDetails?.favoritesCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Favorites
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userDetails?.applicationsCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Applications
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userDetails?.coursesInterested || 0}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Interested
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {userDetails?.recentApplications?.length > 0 ? (
                  <div className="space-y-3">
                    {userDetails.recentApplications.map((application: any) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Application #{application.id}</div>
                            <div className="text-sm text-gray-600">
                              {application.courseDetails?.length || 0} course(s) selected
                            </div>
                            <div className="text-xs text-gray-500">
                              {application.createdAt ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true }) : 'Recently'}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No applications yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Favorite Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {userDetails?.favoriteCourses?.length > 0 ? (
                  <div className="space-y-3">
                    {userDetails.favoriteCourses.map((favorite: any) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-medium">{favorite.course.name}</div>
                        <div className="text-sm text-gray-600">{favorite.course.university.name}</div>
                        <div className="text-xs text-gray-500">
                          Added {formatDistanceToNow(new Date(favorite.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No favorite courses yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Contact User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}