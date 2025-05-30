import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Mail, 
  FileText,
  Calendar,
  User,
  GraduationCap
} from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Application } from "@/types";
import { formatDistanceToNow, format } from "date-fns";

export default function ApplicationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch all applications
  const { data: applications = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/applications", searchTerm, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const url = `/api/admin/applications${params.toString() ? '?' + params.toString() : ''}`;
      return fetch(url, { credentials: "include" }).then(res => res.json());
    },
  });

  // Update application status
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: string }) => 
      apiRequest("PATCH", `/api/admin/applications/${applicationId}/status`, { status }),
    onSuccess: () => {
      toast({ title: "Application status updated! User will be notified." });
      // Refresh admin applications
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      // Refresh user applications so they see the updated status immediately
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      // Refresh notifications so user sees the new notification
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'submitted to university': return 'bg-purple-100 text-purple-800';
      case 'offer issued': return 'bg-green-100 text-green-800';
      case 'cas requested': return 'bg-orange-100 text-orange-800';
      case 'cas issued': return 'bg-indigo-100 text-indigo-800';
      case 'student visa application submitted': return 'bg-pink-100 text-pink-800';
      case 'visa approved': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const applicationStatuses = [
    'Submitted',
    'Reviewing', 
    'Submitted to University',
    'Offer Issued',
    'CAS Requested',
    'CAS Issued',
    'Student Visa Application Submitted',
    'Visa Approved'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Management</h2>
          <p className="text-gray-600">Track and manage all student applications</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {applicationStatuses.map(status => (
                  <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              Total Applications: <span className="font-medium ml-1">{applications.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {(application as any).fullName || 'No Name'}
                        </h3>
                        <Badge className={getStatusBadgeColor((application as any).status || 'submitted')}>
                          {(application as any).status || 'Submitted'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {(application as any).email || 'No email'}
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {application.courseDetails?.length || 0} course(s)
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {application.createdAt ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true }) : 'Recently'}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          ID: #{application.id}
                        </div>
                      </div>
                      
                      {application.courseDetails && application.courseDetails.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700 font-medium">
                            Primary: {application.courseDetails[0].name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {application.courseDetails[0].universityName}
                          </p>
                          {application.courseDetails.length > 1 && (
                            <p className="text-xs text-gray-500">
                              +{application.courseDetails.length - 1} more course(s)
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Select
                        value={application.status?.toLowerCase() || 'submitted'}
                        onValueChange={(status) => updateStatusMutation.mutate({ 
                          applicationId: application.id, 
                          status: applicationStatuses.find(s => s.toLowerCase() === status) || status
                        })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {applicationStatuses.map(status => (
                            <SelectItem key={status} value={status.toLowerCase()}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal 
          application={selectedApplication} 
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}

// Application Detail Modal Component
function ApplicationDetailModal({ application, isOpen, onClose }: { application: any; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <div>Application #{application.id}</div>
              <div className="text-sm font-normal text-gray-600">{application.fullName}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Information */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applicant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Full Name</div>
                  <div className="text-sm">{application.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-sm">{application.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Phone</div>
                  <div className="text-sm">{application.phone}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <Badge className={getStatusBadgeColor(application.status || 'submitted')}>
                    {application.status || 'Submitted'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Submitted</div>
                  <div className="text-sm">
                    {application.createdAt ? format(new Date(application.createdAt), 'PPP') : 'Recently'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {application.courseDetails && application.courseDetails.length > 0 ? (
                  <div className="space-y-4">
                    {application.courseDetails.map((course: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{course.universityName}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Level: {course.level} | Subject: {course.subject}
                        </div>
                        {course.requirements && (
                          <div className="text-xs text-gray-500 mt-1">
                            Requirements: {course.requirements}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No course details available
                  </div>
                )}
              </CardContent>
            </Card>

            {application.additionalNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{application.additionalNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Application Submitted</div>
                      <div className="text-xs text-gray-500">
                        {application.createdAt ? format(new Date(application.createdAt), 'PPP') : 'Recently'}
                      </div>
                    </div>
                  </div>
                  
                  {application.updatedAt && application.updatedAt !== application.createdAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">Status Updated</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(application.updatedAt), 'PPP')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
            Contact Applicant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'reviewing': return 'bg-yellow-100 text-yellow-800';
    case 'submitted to university': return 'bg-purple-100 text-purple-800';
    case 'offer issued': return 'bg-green-100 text-green-800';
    case 'cas requested': return 'bg-orange-100 text-orange-800';
    case 'cas issued': return 'bg-indigo-100 text-indigo-800';
    case 'student visa application submitted': return 'bg-pink-100 text-pink-800';
    case 'visa approved': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}