import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  Calendar,
  Mail,
  Settings,
  BarChart3,
  School,
  MessageSquare,
  Edit,
  Eye,
  Plus,
  Building,
  Phone,
  MapPin
} from "@/lib/icons";

const APPLICATION_STATUSES = [
  "Submitted",
  "Reviewing", 
  "Submitted to University",
  "Offer Issued",
  "CAS Requested",
  "CAS Issued",
  "Student Visa Application Submitted",
  "Visa Approved"
];

const LEAD_STATUSES = [
  "New",
  "Contacted", 
  "Qualified",
  "Proposal Sent",
  "Follow Up",
  "Converted",
  "Lost"
];

const LEAD_SOURCES = [
  "Website",
  "Social Media",
  "Referral",
  "Event",
  "Advertisement",
  "Direct"
];

export default function ComprehensiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: universities } = useQuery({
    queryKey: ["/api/universities"],
  });

  // Mutations for updating data
  const updateApplicationStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/admin/applications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      // Refresh user applications so they see the updated status immediately
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      // Refresh notifications so user sees the new notification
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      toast({ title: "Application status updated! User will be notified." });
    },
  });

  const createLead = useMutation({
    mutationFn: (leadData: any) =>
  apiRequest("/api/admin/leads", {
    method: "POST",
    body: JSON.stringify(leadData),
  }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Lead created successfully" });
    },
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Submitted": "bg-blue-100 text-blue-800 border-blue-200",
      "Reviewing": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Submitted to University": "bg-purple-100 text-purple-800 border-purple-200",
      "Offer Issued": "bg-green-100 text-green-800 border-green-200",
      "CAS Requested": "bg-orange-100 text-orange-800 border-orange-200",
      "CAS Issued": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Student Visa Application Submitted": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Visa Approved": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getLeadStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "New": "bg-blue-100 text-blue-800",
      "Contacted": "bg-yellow-100 text-yellow-800",
      "Qualified": "bg-purple-100 text-purple-800",
      "Proposal Sent": "bg-orange-100 text-orange-800",
      "Follow Up": "bg-indigo-100 text-indigo-800",
      "Converted": "bg-green-100 text-green-800",
      "Lost": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Study in UK Admin Panel</h1>
              <p className="text-slate-600 mt-1">Comprehensive platform management system</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">
                Super Administrator
              </Badge>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats?.totalUsers ?? 0}</div>
                  <p className="text-sm text-slate-500 mt-1">
                    +{stats?.newUsersThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Applications</CardTitle>
                  <FileText className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats?.totalApplications ?? 0}</div>
                  <p className="text-sm text-slate-500 mt-1">
                    +{stats?.newApplicationsThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Leads</CardTitle>
                  <UserPlus className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats?.totalLeads ?? 0}</div>
                  <p className="text-sm text-slate-500 mt-1">
                    +{stats?.newLeadsThisWeek ?? 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats?.conversionRate ?? 0}%</div>
                  <p className="text-sm text-slate-500 mt-1">
                    Lead to application ratio
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications?.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{app.fullName}</p>
                          <p className="text-sm text-slate-500">{app.email}</p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-center py-4">No recent applications</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads?.slice(0, 5).map((lead: any) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.source}</p>
                        </div>
                        <Badge className={getLeadStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-center py-4">No recent leads</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Lead Management</h2>
              <CreateLeadDialog onCreateLead={createLead} />
            </div>
            
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {leadsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="space-y-4">
                    {leads.map((lead: any) => (
                      <div key={lead.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                              <Badge className={getLeadStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">{lead.phone || 'Not provided'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">Source: {lead.source}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Unknown'}
                                </span>
                              </div>
                            </div>
                            {lead.notes && (
                              <p className="text-sm text-slate-600 mt-2 p-2 bg-white rounded border">
                                {lead.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No leads found. Create your first lead to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-semibold text-lg">
                              {(user.firstName || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.email}
                            </p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            {user.phone && (
                              <p className="text-sm text-slate-500">{user.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </p>
                          <Badge className="bg-green-100 text-green-800 mt-1">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab with Status Management */}
          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Application Management</h2>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {appsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-6">
                    {applications.map((app: any) => (
                      <div key={app.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{app.fullName}</h3>
                            <p className="text-sm text-slate-600">{app.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Select
                              value={app.status}
                              onValueChange={(newStatus) => 
                                updateApplicationStatus.mutate({ id: app.id, status: newStatus })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {APPLICATION_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Application Timeline */}
                        <div className="mb-4">
                          <Badge className={getStatusColor(app.status)}>
                            Current Status: {app.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Phone:</span>
                            <span className="ml-2 text-slate-900">{app.phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Academic Level:</span>
                            <span className="ml-2 text-slate-900">{app.academicLevel || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Applied:</span>
                            <span className="ml-2 text-slate-900">
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Application ID:</span>
                            <span className="ml-2 text-slate-900">#{app.id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No applications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Course & University Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
                <Button variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Add University
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Universities */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {universities?.map((uni: any) => (
                      <div key={uni.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-900">{uni.name}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {uni.city}, {uni.country}
                        </p>
                      </div>
                    )) || (
                      <p className="text-slate-500 col-span-full text-center py-4">No universities found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Courses */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses?.map((course: any) => (
                      <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{course.name}</h3>
                            <p className="text-sm text-slate-600">{course.university?.name}</p>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                              <span>Level: {course.level}</span>
                              <span>Duration: {course.duration}</span>
                              <span>Fee: {course.tuitionFee}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-center py-4">No courses found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Platform Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Users</span>
                      <span className="font-semibold text-slate-900">{analytics?.totalUsers ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Applications</span>
                      <span className="font-semibold text-slate-900">{analytics?.totalApplications ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Conversion Rate</span>
                      <span className="font-semibold text-slate-900">{analytics?.conversionRate ?? 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Active Leads</span>
                      <span className="font-semibold text-slate-900">{analytics?.totalLeads ?? 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">API Services</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Admin Security</span>
                      <Badge className="bg-green-100 text-green-800">Secured</Badge>
                    </div>
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

// Create Lead Dialog Component
function CreateLeadDialog({ onCreateLead }: { onCreateLead: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "New",
    interestedCourses: "",
    notes: ""
  });

  const handleSubmit = () => {
    onCreateLead.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          source: "",
          status: "New", 
          interestedCourses: "",
          notes: ""
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          Create Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Lead name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="courses">Interested Courses</Label>
            <Input
              id="courses"
              value={formData.interestedCourses}
              onChange={(e) => setFormData({ ...formData, interestedCourses: e.target.value })}
              placeholder="Course interests"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={onCreateLead.isPending}>
            {onCreateLead.isPending ? "Creating..." : "Create Lead"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}