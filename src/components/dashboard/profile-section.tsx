import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import ApplicationStatusModal from "./application-status-modal";
import type { Application } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function ProfileSection() {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch user applications
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "Submitted": "bg-blue-100 text-blue-800",
      "Reviewing": "bg-yellow-100 text-yellow-800", 
      "Submitted to University": "bg-purple-100 text-purple-800",
      "Offer Issued": "bg-green-100 text-green-800",
      "CAS Requested": "bg-orange-100 text-orange-800",
      "CAS Issued": "bg-indigo-100 text-indigo-800",
      "Student Visa Application Submitted": "bg-pink-100 text-pink-800",
      "Visa Approved": "bg-emerald-100 text-emerald-800",
      // Legacy status support
      "Accepted": "bg-green-100 text-green-800",
      "Rejected": "bg-red-100 text-red-800",
      "Under Review": "bg-yellow-100 text-yellow-800",
      "Pending": "bg-gray-100 text-gray-800"
    };
    
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const formatStatus = (status: string) => {
    const statusLabels = {
      submitted: "Submitted",
      reviewing: "Reviewing",
      submitted_to_university: "Submitted to University",
      offer_issued: "Offer Issued",
      cas_requested: "CAS Requested",
      cas_issued: "CAS Issued",
      visa_application_submitted: "Visa Application Submitted",
      visa_approved: "Visa Approved",
      // Legacy status support
      accepted: "Accepted",
      rejected: "Rejected",
      under_review: "Under Review",
      pending: "Pending"
    };
    
    return statusLabels[status as keyof typeof statusLabels] || status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={
                user?.user_metadata?.avatar_url || 
                user?.user_metadata?.picture || 
                user?.profileImageUrl || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=3b82f6&color=fff&size=64`
              } 
              alt="User profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h4 className="font-medium text-gray-900">
                {user?.user_metadata?.full_name || 
                 user?.user_metadata?.name || 
                 user?.email?.split('@')[0] || 
                 'User'}
              </h4>
              <p className="text-sm text-gray-500 break-all overflow-hidden max-w-full">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="text-gray-900">
                {user?.created_at 
                  ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
                  : "Recently joined"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border-l-4 border-primary pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-gray-900">
                      {(application as any).courseDetails && (application as any).courseDetails.length > 0 
                        ? (application as any).courseDetails[0].name
                        : `Application #${application.id}`
                      }
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={getStatusColor(application.status)}
                      >
                        {formatStatus(application.status)}
                      </Badge>
                      <Badge 
                        className="bg-blue-100 text-blue-800 cursor-pointer hover:opacity-80 transition-opacity text-center"
                        onClick={() => setSelectedApplication(application)}
                      >
                        View Details
                      </Badge>
                    </div>
                  </div>
                  {(application as any).courseDetails && (application as any).courseDetails.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      {(application as any).courseDetails[0].universityName}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Submitted {application.createdAt ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true }) : 'Recently'}
                  </div>
                  {(application as any).courseDetails && (application as any).courseDetails.length > 1 && (
                    <div className="text-sm text-gray-600 mt-1">
                      +{(application as any).courseDetails.length - 1} more course(s)
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No applications submitted yet.</p>
          )}
        </CardContent>
      </Card>

      {selectedApplication && (
        <ApplicationStatusModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
