import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  FileText, 
  TrendingUp,
} from "@/lib/icons";

export default function SimpleAdminDashboard() {
  // Fetch admin data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Study in UK platform</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Super Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats?.totalUsers ?? 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    +{stats?.newUsersThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                  <FileText className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats?.totalApplications ?? 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    +{stats?.newApplicationsThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                  <UserPlus className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats?.totalLeads ?? 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    +{stats?.newLeadsThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats?.conversionRate ?? 0}%
                  </div>
                  <p className="text-xs text-gray-500">
                    Applications to users ratio
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications && applications.length > 0 ? (
                    <div className="space-y-3">
                      {applications.slice(0, 5).map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{app.fullName}</p>
                            <p className="text-sm text-gray-500">{app.email}</p>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No applications yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Database</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">API Services</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Admin Security</span>
                      <Badge className="bg-green-100 text-green-800">Secured</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Registered Users</CardTitle>
                <p className="text-gray-600">All students registered on your platform</p>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {(user.firstName || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.email}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Student Applications</CardTitle>
                <p className="text-gray-600">Track all university applications</p>
              </CardHeader>
              <CardContent>
                {appsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div key={app.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{app.fullName}</h3>
                            <p className="text-sm text-gray-600">{app.email}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {app.status || 'Pending'}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <span className="ml-2 text-gray-900">{app.phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Academic Level:</span>
                            <span className="ml-2 text-gray-900">{app.academicLevel || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No applications found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-semibold text-gray-900">{analytics?.totalUsers ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Applications</span>
                      <span className="font-semibold text-gray-900">{analytics?.totalApplications ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-gray-900">{analytics?.conversionRate ?? 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <span className="font-medium text-blue-900">Export User Data</span>
                      <p className="text-sm text-blue-700">Download user information</p>
                    </button>
                    <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <span className="font-medium text-green-900">Generate Report</span>
                      <p className="text-sm text-green-700">Create analytics report</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}