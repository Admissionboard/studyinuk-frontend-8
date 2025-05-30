import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus,
  GraduationCap, 
  FileText,
  TrendingUp,
} from "@/lib/icons";
import LeadManagement from "./lead-management";
import UserManagement from "./user-management";
import ApplicationManagement from "./application-management";
import CourseManagement from "./course-management";
import AnalyticsDashboard from "./analytics-dashboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch overview stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Debug log to see what data we're getting
  console.log("Admin Stats Data:", stats);
  console.log("Stats type:", typeof stats);
  console.log("Stats keys:", Object.keys(stats || {}));

  // Safely access stats data
  const totalUsers = stats?.totalUsers || 0;
  const totalApplications = stats?.totalApplications || 0;
  const totalCourses = stats?.totalCourses || 0;
  const conversionRate = stats?.conversionRate || 0;
  const newUsersThisWeek = stats?.newUsersThisWeek || 0;
  const newApplicationsThisWeek = stats?.newApplicationsThisWeek || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading admin dashboard. Please check your permissions.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Study in UK - CRM & Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 px-3 py-1">
                Administrator
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Overview</TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Leads</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Users</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Applications</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Courses</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-gray-600 font-medium">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800">Admin Panel Status:</h3>
              <p className="text-blue-700 mt-2">Working on displaying real database numbers. API calls are successful but data display needs fixing.</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                  <UserPlus className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">0</div>
                  <p className="text-xs text-gray-500">
                    +0 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                  <Users className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{totalUsers}</div>
                  <p className="text-xs text-gray-500">
                    +{newUsersThisWeek} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                  <FileText className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{totalApplications}</div>
                  <p className="text-xs text-gray-500">
                    +{newApplicationsThisWeek} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{conversionRate}%</div>
                  <p className="text-xs text-gray-500">
                    Lead to user conversion
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentLeads?.map((lead: any) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          <p className="text-xs text-gray-500">Source: {lead.source}</p>
                        </div>
                        <Badge 
                          variant={lead.status === 'new' ? 'default' : 'secondary'}
                          className={lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentApplications?.map((application: any) => (
                      <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{application.fullName}</p>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-xs text-gray-500">
                            {application.courseDetails?.length || 0} course(s)
                          </p>
                        </div>
                        <Badge variant="outline">
                          {application.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationManagement />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}