import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "@/lib/icons";
import type { Application } from "@/types";

interface ApplicationStatusModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

const APPLICATION_STAGES = [
  { id: "Submitted", label: "Submitted", description: "Application has been submitted" },
  { id: "Reviewing", label: "Reviewing", description: "Our team is reviewing your application" },
  { id: "Submitted to University", label: "Submitted to University", description: "Application sent to the university" },
  { id: "Offer Issued", label: "Offer Issued", description: "University has made an offer" },
  { id: "CAS Requested", label: "CAS Requested", description: "Confirmation of Acceptance for Studies requested" },
  { id: "CAS Issued", label: "CAS Issued", description: "CAS document has been issued" },
  { id: "Student Visa Application Submitted", label: "Student Visa Application Submitted", description: "Visa application submitted to UK authorities" },
  { id: "Visa Approved", label: "Visa Approved", description: "Student visa has been approved" }
];

export default function ApplicationStatusModal({ application, isOpen, onClose }: ApplicationStatusModalProps) {
  // Find the current stage, handling case-insensitive matching
  const currentStageIndex = APPLICATION_STAGES.findIndex(stage => 
    stage.id.toLowerCase() === (application.status || '').toLowerCase()
  );

  const getStageIcon = (index: number) => {
    if (index < currentStageIndex) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (index === currentStageIndex) {
      return <Clock className="w-5 h-5 text-blue-500" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStageColor = (index: number) => {
    if (index < currentStageIndex) {
      return "bg-green-100 text-green-800";
    } else if (index === currentStageIndex) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" aria-describedby="application-status-description">
        <DialogHeader>
          <DialogTitle>Application Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div id="application-status-description" className="text-sm text-gray-600 mb-4">
            Application #{application.id} for {application.fullName}
          </div>

          {/* Current Status Highlight */}
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              <strong>Current Status:</strong> {APPLICATION_STAGES[currentStageIndex]?.label || 'Unknown'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              We'll notify you when your application moves to the next stage.
            </p>
          </div>

          {/* Compact Timeline */}
          <div className="relative max-h-64 overflow-y-auto">
            {APPLICATION_STAGES.map((stage, index) => (
              <div key={stage.id} className="relative flex items-start space-x-3 pb-3 last:pb-0">
                {/* Progress Line */}
                {index < APPLICATION_STAGES.length - 1 && (
                  <div className="absolute left-2.5 top-5 w-0.5 h-6 bg-gray-200">
                    <div 
                      className={`w-full transition-all duration-300 ${
                        index < currentStageIndex ? 'bg-green-500 h-full' : 'h-0'
                      }`}
                    />
                  </div>
                )}
                
                {/* Stage Icon */}
                <div className="flex-shrink-0 relative z-10">
                  {getStageIcon(index)}
                </div>
                
                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-xs ${
                      index <= currentStageIndex ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                    {index === currentStageIndex && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">
                        Current
                      </Badge>
                    )}
                  </div>
                  {/* Only show description for current and completed stages to save space */}
                  {index <= currentStageIndex && (
                    <p className="text-xs text-gray-600">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}