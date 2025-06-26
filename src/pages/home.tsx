import { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import NotificationBell from "@/components/layout/notification-bell";
import CourseCard from "@/components/courses/course-card";
import CourseDetailsModal from "@/components/courses/course-details-modal";
import CourseFilters from "@/components/courses/course-filters";
import ApplicationForm from "@/components/application/application-form";
import ProfileSection from "@/components/dashboard/profile-section";
import NotificationsSection from "@/components/dashboard/notifications-section";
import TutorialsSection from "@/components/dashboard/tutorials-section";
import { SEOHead } from "@/components/SEOHead";
import { seoPages, generateDynamicSEO } from "@/lib/seo-data";
import FloatingActionButton from "@/components/common/floating-action-button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { CourseWithUniversity, Counselor } from "@/types";
import { Button } from "@/components/ui/button";
import CounselorCard from "@/components/counselors/counselor-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function CompareCoursesSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["/api/favorites"],
    queryFn: () => apiRequest("/api/favorites"),
  });
  
 console.log("Favorites data:", favorites);

  const toggleSelect = (courseId: string) => {
    if (selectedIds.includes(courseId)) {
      setSelectedIds(selectedIds.filter((id) => id !== courseId));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, courseId]);
    } else {
      alert("You can compare maximum 3 courses.");
    }
  };

  const selectedCourses = favorites?.filter((c: any) => selectedIds.includes(c.course.id));

  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="mt-10 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Compare Courses</h2>

      {!hasFavorites ? (
        <p className="text-gray-500">Make some courses favorite to compare.</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Select up to 3 favorite courses to compare.
          </p>

          <div className="space-y-3">
            {favorites.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.course.name}</p>
                  <p className="text-sm text-gray-500">{item.course.university.name}</p>
                </div>
                <Checkbox
                  checked={selectedIds.includes(item.course.id)}
                  onCheckedChange={() => toggleSelect(item.course.id)}
                />
              </div>
            ))}
          </div>

          <Button
            disabled={selectedIds.length < 2}
            onClick={() => setModalOpen(true)}
            className="mt-4"
          >
            Compare Selected
          </Button>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl overflow-x-auto">
          <DialogHeader>
            <DialogTitle>Course Comparison</DialogTitle>
          </DialogHeader>

          {selectedCourses?.length > 0 && (
            <table className="table-auto w-full border text-left text-sm mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">University</th>
                  {selectedCourses.map((c: any, i: number) => (
                    <th key={i} className={`border p-2 bg-${["white", "blue-50", "green-50"][i]}`}>
                      {c.course.university.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Subject</td>
                  {selectedCourses.map((c: any, i: number) => (
                    <td key={i} className={`border p-2 bg-${["white", "blue-50", "green-50"][i]}`}>
                      {c.course.name}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Tuition Fee</td>
                  {selectedCourses.map((c: any, i: number) => (
                    <td key={i} className={`border p-2 bg-${["white", "blue-50", "green-50"][i]}`}>
                      £{parseInt(c.course.tuitionFee).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
  <td className="border p-2 font-medium">Scholarships</td>
  {selectedCourses.map((c, i) => (
    <td key={i} className="border p-2">
      {c.course.scholarships && c.course.scholarships.length > 0
        ? c.course.scholarships.join(", ")
        : "None"}
    </td>
  ))}
</tr>
                <tr>
                  <td className="border p-2 font-medium">IELTS</td>
                  {selectedCourses.map((c: any, i: number) => (
                    <td key={i} className={`border p-2 bg-${["white", "blue-50", "green-50"][i]}`}>
                      {c.course.ieltsOverall}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState<CourseWithUniversity | null>(null);

  const [courseFilters, setCourseFilters] = useState({
    search: "",
    faculty: "",
    level: "",
    ieltsScore: "",
  });

  const resetFilters = () => {
    setCourseFilters({ search: "", faculty: "", level: "", ieltsScore: "" });
  };

  const {
    data,
    isLoading: coursesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["courses", courseFilters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      if (courseFilters.search) params.append("search", courseFilters.search);
      if (courseFilters.faculty && courseFilters.faculty !== "All Faculties") params.append("faculty", courseFilters.faculty);
      if (courseFilters.level && courseFilters.level !== "All Levels") params.append("level", courseFilters.level);
      if (courseFilters.ieltsScore && courseFilters.ieltsScore !== "All IELTS Scores") params.append("ieltsScore", courseFilters.ieltsScore);
      params.append("limit", "100");
      params.append("offset", pageParam.toString());
      const url = `/api/courses?${params.toString()}`;
      return apiRequest(url);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 100) return undefined;
      return allPages.length * 100;
    },
    enabled: activeTab === "courses",
    staleTime: 5 * 60 * 1000,
  });


const { data: favorites, isLoading: favoritesLoading } = useQuery({
  queryKey: ["/api/favorites", user?.id],
  queryFn: async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id || "", // 🧠 Send user ID in header
      },
    });
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  },
  enabled: activeTab === "favorites" && !!user?.id,
});

  const { data: counselors = [], isLoading: counselorsLoading } = useQuery<Counselor[]>({
    queryKey: ["/api/counselors"],
    enabled: activeTab === "counselors",
    staleTime: 5 * 60 * 1000,
  });

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      courses: "Courses",
      favorites: "Favorite Courses",
      counselors: "Education Counsellors",
      apply: "Submit Application",
      dashboard: "My Dashboard",
    };
    return titles[activeTab] || "Study in UK";
  };

  const defaultSEO = {
    title: "Study in UK",
    description: "Find top UK universities and courses tailored for you.",
    keywords: "UK universities, study in UK, courses, IELTS",
    structuredData: {},
  };

  const dynamicSEO = generateDynamicSEO();
  const currentSEO = (() => {
    if (activeTab === "courses") return { ...defaultSEO, ...seoPages.courses, ...dynamicSEO };
    if (activeTab === "counselors") return { ...defaultSEO, ...seoPages.counselors };
    if (activeTab === "favorites") return { ...defaultSEO, ...seoPages.favorites };
    return defaultSEO;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        canonicalUrl={`https://studyinuk.co/${activeTab === "courses" ? "" : activeTab}`}
        structuredData={currentSEO.structuredData}
      />

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="md:ml-64 pb-20 md:pb-0">
        <header className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Study in UK</h1>
                <p className="text-sm text-gray-600">For Bangladeshi Students</p>
              </div>
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
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=3b82f6&color=fff&size=32`
                    }
                    alt="User profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      user?.email?.split('@')[0] ||
                      'User'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === "courses" && (
          <div className="mb-4">
            <CourseFilters
              filters={courseFilters}
              onFiltersChange={setCourseFilters}
              onReset={resetFilters}
            />

            {coursesLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin-slow mb-4"></div>
                <p className="text-lg font-semibold text-gray-800">Loading Courses...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait <span id="countdown">30</span> seconds while we fetch over 2000 course records.
                </p>
                <script dangerouslySetInnerHTML={{
                  __html: `
                    let seconds = 30;
                    const countdownEl = document.getElementById("countdown");
                    const interval = setInterval(() => {
                      seconds--;
                      if (countdownEl) countdownEl.textContent = seconds;
                      if (seconds <= 0) clearInterval(interval);
                    }, 1000);
                  `
                }} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(data?.pages?.flat() || []).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onViewDetails={setSelectedCourse}
                    />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
                    >
                      {isFetchingNextPage ? "Loading more..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}

            {!coursesLoading && data?.pages?.flat().length === 0 && (
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
              <div className="text-center py-12">Loading favorites...</div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => (
                  <CourseCard
                    key={fav.course.id}
                    course={fav.course}
                    onViewDetails={setSelectedCourse}
                    isFavorite
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">💔</div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">No favorites found</h3>
              </div>
            )}
          </div>
        )}

        {activeTab === "counselors" && (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Education Counsellors</h2>
            {counselorsLoading ? (
              <div className="text-center py-12">Loading counselors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {counselors.map((c) => (
                  <CounselorCard key={c.id} counselor={c} />
                ))}
              </div>
            )}
          </div>
        )}

{activeTab === "apply" && (
  <div className="p-4 md:p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Submit Application</h2>
    <ApplicationForm
      favorites={favorites || []}
      onNavigateToCourses={() => setActiveTab("courses")}
    />
  </div>
)}

{activeTab === "dashboard" && (
  <div className="p-4 md:p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">My Dashboard</h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <ProfileSection />
        <CompareCoursesSection />
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
);
}

export default Home;