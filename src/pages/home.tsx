import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import NotificationBell from "@/components/layout/notification-bell";
import CourseCard from "@/components/courses/course-card";
import CourseDetailsModal from "@/components/courses/course-details-modal";
import CourseFilters from "@/components/courses/course-filters";
import CourseSkeleton from "@/components/courses/course-skeleton";
import CounselorCard from "@/components/counselors/counselor-card";
import ApplicationForm from "@/components/application/application-form";
import ProfileSection from "@/components/dashboard/profile-section";
import NotificationsSection from "@/components/dashboard/notifications-section";
import TutorialsSection from "@/components/dashboard/tutorials-section";
import { SEOHead } from "@/components/SEOHead";
import { seoPages, generateDynamicSEO } from "@/lib/seo-data";
import FloatingActionButton from "@/components/common/floating-action-button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import type { CourseWithUniversity, Counselor } from "@/types";

export default function Home() {
const { user } = useAuth();
const [activeTab, setActiveTab] = useState("courses");
const [selectedCourse, setSelectedCourse] = useState<CourseWithUniversity | null>(null);
const [courseFilters, setCourseFilters] = useState({
search: "",
faculty: "",
level: "",
ieltsScore: "",
});
const \[page, setPage] = useState(1);

const resetFilters = () => {
setCourseFilters({ search: "", faculty: "", level: "", ieltsScore: "" });
setPage(1);
};

const { data: courses = \[], isLoading: coursesLoading } = useQuery\<CourseWithUniversity\[]>({
queryKey: \["/api/courses", courseFilters.search, courseFilters.faculty, courseFilters.level, courseFilters.ieltsScore],
queryFn: async () => {
const params = new URLSearchParams();
if (courseFilters.search) params.append("search", courseFilters.search);
if (courseFilters.faculty && courseFilters.faculty !== "All Faculties") params.append("faculty", courseFilters.faculty);
if (courseFilters.level && courseFilters.level !== "All Levels") params.append("level", courseFilters.level);
if (courseFilters.ieltsScore && courseFilters.ieltsScore !== "All IELTS Scores") params.append("ieltsScore", courseFilters.ieltsScore);
const url = `/api/courses${params.toString() ? "?" + params.toString() : ""}`;
return apiRequest(url);
},
enabled: activeTab === "courses",
staleTime: 5 \* 60 \* 1000,
});

const { data: favorites = \[], isLoading: favoritesLoading } = useQuery\<any\[]>({
queryKey: \["/api/favorites"],
enabled: !!user && activeTab === "favorites",
staleTime: 5 \* 60 \* 1000,
});

const { data: counselors = \[], isLoading: counselorsLoading } = useQuery\<Counselor\[]>({
queryKey: \["/api/counselors"],
enabled: activeTab === "counselors",
staleTime: 5 \* 60 \* 1000,
});

const handleTabChange = (tab: string) => setActiveTab(tab);

const getPageTitle = () => {
const titles: Record\<string, string> = {
courses: "Courses",
favorites: "Favorite Courses",
counselors: "Education Counsellors",
apply: "Submit Application",
dashboard: "My Dashboard",
};
return titles\[activeTab] || "Study in UK";
};

const dynamicSEO = generateDynamicSEO();
const currentSEO = activeTab === "courses"
? { ...seoPages.courses, ...dynamicSEO }
: activeTab === "counselors"
? seoPages.counselors
: activeTab === "favorites"
? seoPages.favorites
: seoPages.courses;

return ( <div className="min-h-screen bg-slate-50">
\<SEOHead
title={currentSEO.title}
description={currentSEO.description}
keywords={currentSEO.keywords}
canonicalUrl={`https://studyinuk.co/${activeTab === "courses" ? "" : activeTab}`}
structuredData={currentSEO.structuredData}
/> <Navbar activeTab={activeTab} onTabChange={handleTabChange} /> <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

```
  <main className="md:ml-64 pb-20 md:pb-0">
    <header className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-gray-900">Study in UK</h1>
          <p className="text-sm text-gray-600">For Bangladeshi Students</p>
        </div>
        <div className="hidden md:block">
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          {user && (
            <div className="flex items-center space-x-3">
              <img
                src={
                  user?.user_metadata?.avatar_url ||
                  user?.user_metadata?.picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || "User")}&background=3b82f6&color=fff&size=32`
                }
                alt="User profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="hidden md:block text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>

    {activeTab === "courses" && (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <CourseFilters filters={courseFilters} onFiltersChange={setCourseFilters} />
          <Button onClick={resetFilters} className="bg-blue-600 text-white hover:bg-blue-700 transition">
            🔄 Reset Filters
          </Button>
        </div>

        {coursesLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              ⏳ Loading courses... please wait.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={setSelectedCourse}
              />
            ))}
          </div>
        )}

        {!coursesLoading && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    )}

    {activeTab === "favorites" && (
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Favorite Courses</h2>
        {favoritesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <CourseCard
                key={favorite.course.id}
                course={favorite.course}
                onViewDetails={setSelectedCourse}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Favorite Courses</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Browse our course catalog and save courses you're interested in to create your personalized favorites list.
            </p>
            <button
              onClick={() => setActiveTab("courses")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    )}

    {activeTab === "counselors" && (
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Education Counsellors</h2>
        {counselorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <CounselorCard key={counselor.id} counselor={counselor} />
            ))}
          </div>
        )}
      </div>
    )}

    {activeTab === "apply" && (
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Submit Application</h2>
        <ApplicationForm favorites={favorites} onNavigateToCourses={() => setActiveTab("courses")} />
      </div>
    )}

    {activeTab === "dashboard" && (
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">My Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileSection />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <NotificationsSection />
            <TutorialsSection />
          </div>
        </div>
      </div>
    )}
  </main>

  {selectedCourse && (
    <CourseDetailsModal
      course={selectedCourse}
      isOpen={!!selectedCourse}
      onClose={() => setSelectedCourse(null)}
      onNavigateToApply={() => setActiveTab("apply")}
    />
  )}

  <FloatingActionButton onQuickApply={() => setActiveTab("apply")} />
</div>
```

);
}
