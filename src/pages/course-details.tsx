import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, DollarSign, GraduationCap, Calendar, Globe, Phone, Mail } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { generateCourseStructuredData } from "@/lib/seo-data";
import type { CourseWithUniversity } from "@/types";

export default function CourseDetails() {
  const [, params] = useRoute("/courses/:courseId");
  const courseId = params?.courseId;

  // Fetch course details
  const { data: course, isLoading, error } = useQuery<CourseWithUniversity>({
    queryKey: ["/api/courses", courseId],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      return response.json();
    },
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate SEO data for this specific course
  const courseTitle = `${course.name} at ${course.university.name} | Study in UK`;
  const courseDescription = `Study ${course.name} at ${course.university.name} in ${course.university.city}, UK. ${course.level} program with ${course.duration} duration. Tuition: ${course.currency}${course.tuitionFee}. IELTS requirement: ${course.ieltsOverall}.`;
  const courseKeywords = `${course.name}, ${course.university.name}, ${course.faculty}, ${course.level}, UK universities, study in UK, ${course.university.city}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={courseTitle}
        description={courseDescription}
        keywords={courseKeywords}
        canonicalUrl={`https://studyinuk.co/courses/${courseId}`}
        structuredData={generateCourseStructuredData(course)}
        ogType="article"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>

          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="outline">{course.faculty}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="font-medium">{course.university.name}</span>
                  <span className="mx-2">•</span>
                  <span>{course.university.city}, {course.university.country}</span>
                </div>
              </div>
              
              {course.university.imageUrl && (
                <div className="lg:w-48">
                  <img 
                    src={course.university.imageUrl} 
                    alt={course.university.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Course Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tuition Fee</p>
                        <p className="font-medium">{course.currency}{course.tuitionFee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Study Level</p>
                        <p className="font-medium">{course.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Start Dates</p>
                        <p className="font-medium">{course.startDates || 'September, January'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Entry Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Entry Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">English Language Requirements</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">IELTS Overall:</span>
                          <span className="ml-2 font-medium">{course.ieltsOverall}</span>
                        </div>
                        {course.ieltsListening && (
                          <div>
                            <span className="text-gray-600">IELTS Listening:</span>
                            <span className="ml-2 font-medium">{course.ieltsListening}</span>
                          </div>
                        )}
                        {course.ieltsReading && (
                          <div>
                            <span className="text-gray-600">IELTS Reading:</span>
                            <span className="ml-2 font-medium">{course.ieltsReading}</span>
                          </div>
                        )}
                        {course.ieltsWriting && (
                          <div>
                            <span className="text-gray-600">IELTS Writing:</span>
                            <span className="ml-2 font-medium">{course.ieltsWriting}</span>
                          </div>
                        )}
                        {course.ieltsSpeaking && (
                          <div>
                            <span className="text-gray-600">IELTS Speaking:</span>
                            <span className="ml-2 font-medium">{course.ieltsSpeaking}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Academic Requirements</h4>
                      <p className="text-gray-600 text-sm">
                        Please contact our counselors for specific academic requirements for this program.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* University Information */}
              <Card>
                <CardHeader>
                  <CardTitle>About {course.university.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4">
                        {course.university.name} is located in {course.university.city}, {course.university.country}. 
                        It's a prestigious institution offering world-class education in various fields.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{course.university.city}, {course.university.country}</span>
                        </div>
                        {course.university.googleMapUrl && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a 
                              href={course.university.googleMapUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View on Map
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Now Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get expert guidance for your application to {course.university.name}.
                  </p>
                  <Button className="w-full mb-3">Apply Now</Button>
                  <Button variant="outline" className="w-full">Get Free Consultation</Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>+8801876397805</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>info@studyinuk.co</span>
                    </div>
                    <p className="text-gray-600 mt-3">
                      Our expert counselors are here to help you with your UK study journey.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faculty:</span>
                      <span className="font-medium">{course.faculty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{course.university.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}