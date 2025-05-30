import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  UserPlus, 
  FileText,
  GraduationCap,
  Globe
} from "@/lib/icons";

export default function AnalyticsDashboard() {
  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const statsCards = [
    {
      title: "Total Leads",
      value: analytics?.totalLeads || 0,
      change: "+12%",
      changeType: "positive",
      icon: UserPlus,
    },
    {
      title: "Active Users", 
      value: analytics?.totalUsers || 0,
      change: "+8%",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "Applications",
      value: analytics?.totalApplications || 0,
      change: "+23%", 
      changeType: "positive",
      icon: FileText,
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate || 0}%`,
      change: "+2%",
      changeType: "positive", 
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Facebook</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm">Google</span>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Referrals</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Computer Science</span>
                <span className="text-sm font-medium">156 applications</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Administration</span>
                <span className="text-sm font-medium">98 applications</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Engineering</span>
                <span className="text-sm font-medium">87 applications</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medicine</span>
                <span className="text-sm font-medium">42 applications</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">New lead from Facebook</p>
                <p className="text-xs text-gray-500">John Smith - Computer Science inquiry</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">New application submitted</p>
                <p className="text-xs text-gray-500">Sarah Ahmed - MBA International Business</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Offer issued</p>
                <p className="text-xs text-gray-500">Michael Chen - MSc Data Science</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}