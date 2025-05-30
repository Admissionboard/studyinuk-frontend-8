import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "@/lib/icons";
import type { Tutorial } from "@/types";

export default function TutorialsSection() {
  // Fetch tutorials
  const { data: tutorials = [], isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });

  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tutorial Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-32 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Videos</CardTitle>
      </CardHeader>
      <CardContent>
        {tutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img 
                  src={tutorial.thumbnailUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225"} 
                  alt={tutorial.title} 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{tutorial.title}</h4>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {tutorial.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => openYouTubeVideo(tutorial.youtubeUrl)}
                    className="text-primary hover:text-blue-700 p-0 h-auto bg-transparent hover:bg-transparent"
                    variant="ghost"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tutorial videos available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
