import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CourseWithUniversity } from "@/types";
import { Heart, MapPin, X } from "@/lib/icons";
import { useLocation } from "wouter";
import { getCountryFlag } from "@/lib/country-flags";

interface CourseDetailsModalProps {
  course: CourseWithUniversity;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToApply?: () => void;
}

export default function CourseDetailsModal({ course, isOpen, onClose, onNavigateToApply }: CourseDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Favorites functionality removed

  const showMap = () => {
    if (course.university.googleMapUrl) {
      window.open(course.university.googleMapUrl, '_blank');
    } else {
      // Fallback to search if no Google Maps URL is provided
      const url = `https://www.google.com/maps/search/${encodeURIComponent(course.university.name + " " + course.university.city)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 shadow-xl">
    <DialogHeader className="border-b border-gray-200 pb-4">
      <DialogTitle className="text-2xl font-bold text-gray-900">
        {course.name}
      </DialogTitle>
      <DialogDescription>
        Detailed course information including university, location, IELTS score, tuition fees, and duration.
      </DialogDescription>
    </DialogHeader>
    
    {/* the rest of your modal content */}
  </DialogContent>
</Dialog>
        
        <div className="space-y-6 pt-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 font-medium text-base mb-3">{course.university.name}</p>
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="font-medium flex items-center gap-2">
                {course.university.city}, {getCountryFlag(course.university.country)} {course.university.country}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={showMap}
                className="p-1 h-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
              >
                View on Map
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-300 pb-2">Course Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Level</p>
                <p className="font-semibold text-gray-900 text-base">{course.level}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Duration</p>
                <p className="font-semibold text-gray-900 text-base">{course.duration}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Tuition Fee</p>
                <p className="font-bold text-blue-800 text-lg">
                  £{parseInt(course.tuitionFee).toLocaleString()}/year
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Start Dates</p>
                <div className="flex flex-wrap gap-1">
                  {course.startDates ? (
                    course.startDates.split(', ').map((date, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className={`border font-medium
                          ${index % 4 === 0 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300' : ''}
                          ${index % 4 === 1 ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' : ''}
                          ${index % 4 === 2 ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300' : ''}
                          ${index % 4 === 3 ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300' : ''}
                        `}
                      >
                        {date.trim()}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 font-medium">
                      September
                    </Badge>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 col-span-2">
                <p className="text-sm text-gray-600 font-medium">Faculty</p>
                <p className="font-semibold text-gray-900 text-base">{course.faculty}</p>
              </div>
            </div>
          </div>


          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-300 pb-2">IELTS Requirements</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-bold text-blue-800 text-lg">Overall: {course.ieltsOverall}</p>
              {(course.ieltsListening || course.ieltsReading || course.ieltsWriting || course.ieltsSpeaking) && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {course.ieltsListening && (
                    <div className="bg-white p-2 rounded-md border border-gray-300">
                      <p className="text-sm text-gray-600 font-medium">Listening</p>
                      <p className="font-semibold text-gray-900">{course.ieltsListening}</p>
                    </div>
                  )}
                  {course.ieltsReading && (
                    <div className="bg-white p-2 rounded-md border border-gray-300">
                      <p className="text-sm text-gray-600 font-medium">Reading</p>
                      <p className="font-semibold text-gray-900">{course.ieltsReading}</p>
                    </div>
                  )}
                  {course.ieltsWriting && (
                    <div className="bg-white p-2 rounded-md border border-gray-300">
                      <p className="text-sm text-gray-600 font-medium">Writing</p>
                      <p className="font-semibold text-gray-900">{course.ieltsWriting}</p>
                    </div>
                  )}
                  {course.ieltsSpeaking && (
                    <div className="bg-white p-2 rounded-md border border-gray-300">
                      <p className="text-sm text-gray-600 font-medium">Speaking</p>
                      <p className="font-semibold text-gray-900">{course.ieltsSpeaking}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {course.scholarships && course.scholarships.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-300 pb-2">Available Scholarships</h3>
              <div className="space-y-3">
                {course.scholarships.map((scholarship, index) => (
                  <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg border border-green-200">
                    <p className="font-semibold text-green-800">{scholarship.split(' - ')[0]}</p>
                    {scholarship.includes(' - ') && (
                      <p className="text-sm text-green-700 mt-1">{scholarship.split(' - ')[1]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4 mt-6 pt-6 border-t-2 border-gray-200">
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 border-2 border-gray-300 hover:border-gray-400 shadow-md"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              onClose();
              onNavigateToApply?.();
            }}
            className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 border-2 border-slate-700 hover:border-slate-800 shadow-md"
          >
            Apply Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
