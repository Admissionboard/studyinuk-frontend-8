  import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "@/lib/icons";
import type { Tutorial } from "@/types";

export default function TutorialsSection() {
  const { data: tutorials = [], isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });

  const openYouTubeVideo = (url: string) => {
    window.open(url, "_blank");
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
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
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

  // ✅ Group tutorials by category and include category order
  const groupedMap = new Map<string, { categoryOrder: number; videos: Tutorial[] }>();

  tutorials.forEach((tutorial) => {
    if (!tutorial.category) return;

    if (!groupedMap.has(tutorial.category)) {
      groupedMap.set(tutorial.category, {
        categoryOrder: tutorial.category_order ?? 999,
        videos: [],
      });
    }

    groupedMap.get(tutorial.category)!.videos.push(tutorial);
  });

  // ✅ Sort videos inside each category by `order`
  for (const group of groupedMap.values()) {
    group.videos.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }

  // ✅ Sort categories by category_order
  const groupedArray = [...groupedMap.entries()].sort(
    (a, b) => a[1].categoryOrder - b[1].categoryOrder
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Videos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {groupedArray.map(([category, data]) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <span className="text-xs text-gray-400 block md:hidden">
                👉 Swipe to see more
              </span>
            </div>
            <div className="-mx-2 overflow-x-auto pb-2">
              <div className="flex space-x-4 px-2 snap-x snap-mandatory">
                {data.videos.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="flex-none w-72 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start"
                  >
                    <img
                      src={
                        tutorial.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225"
                      }
                      alt={tutorial.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {tutorial.title}
                      </h4>
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
            </div>
          </div>
        ))}

        {tutorials.length === 0 && (
          <p className="text-gray-500 text-sm">
            No tutorial videos available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}