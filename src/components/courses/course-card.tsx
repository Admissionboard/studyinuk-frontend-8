import { useState } from "react";
import { Heart, MapPin, ExternalLink } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CourseWithUniversity } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getCountryFlag } from "@/lib/country-flags";

interface CourseCardProps {
  course: CourseWithUniversity;
  onViewDetails: (course: CourseWithUniversity) => void;
  isFavorite?: boolean;
}

export default function CourseCard({ course, onViewDetails, isFavorite: initialFavorite = false }: CourseCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { user } = useAuth();

  // Get user's favorites list
  const { data: allFavorites } = useQuery({
    queryKey: ["/api/favorites"],
  });

 // Check if this course is favorited
const isFavorited = Array.isArray(allFavorites)
  ? allFavorites.some((fav: any) => fav.course?.id === course.id || fav.courseId === course.id)
  : false;

cconst toggleFavoriteMutation = useMutation({
  mutationFn: async () => {
    if (isFavorited) {
      return apiRequest(`/api/favorites/${course.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id,
        },
      });
    } else {
      return apiRequest(`/api/favorites`, {
        method: "POST",
        headers: {
          "x-user-id": user?.id,
        },
        body: JSON.stringify({ courseId: course.id }),
      });
    }
  },
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ["/api/favorites", user?.id] });

    const previousFavorites = queryClient.getQueryData<any[]>(["/api/favorites", user?.id]);

    if (isFavorited) {
      queryClient.setQueryData(
        ["/api/favorites", user?.id],
        previousFavorites?.filter((fav: any) => fav.course?.id !== course.id && fav.courseId !== course.id)
      );
    } else {
      queryClient.setQueryData(
        ["/api/favorites", user?.id],
        [...(previousFavorites || []), { courseId: course.id, course }]
      );
    }

    return { previousFavorites };
  },
  onError: (_err, _vars, context) => {
    if (context?.previousFavorites) {
      queryClient.setQueryData(["/api/favorites", user?.id], context.previousFavorites);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/favorites", user?.id] });
  },
});

  const toggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  const showMap = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(course.university.name + " " + course.university.city)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="course-card bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 mr-2">
            {course.name}
          </h3>
          <button
            onClick={toggleFavorite}
            disabled={toggleFavoriteMutation.isPending}
            className={cn(
              "transition-colors p-1 rounded",
              isFavorited 
                ? "text-red-500 hover:text-red-600" 
                : "text-gray-400 hover:text-red-500"
            )}
          >
            <Heart className={cn("text-lg", isFavorited && "fill-current")} />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">{course.university.name}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="flex items-center gap-1">
              {course.university.city}, {getCountryFlag(course.university.country)} {course.university.country}
            </span>
            <button
              onClick={showMap}
              className="ml-2 text-primary hover:text-primary-dark"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{course.level}</span>
            <span className="text-gray-500">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">IELTS: {course.ieltsOverall}</span>
            <span className="font-semibold text-primary">
              £{parseInt(course.tuitionFee).toLocaleString()}/year
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(course)}
          className="w-full bg-primary hover:bg-blue-700"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
