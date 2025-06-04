import { Search } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface CourseFiltersProps {
  filters: {
    search: string;
    faculty: string;
    level: string;
    ieltsScore: string;
  };
  onFiltersChange: (filters: {
    search: string;
    faculty: string;
    level: string;
    ieltsScore: string;
  }) => void;
  onReset?: () => void; // <-- Add this line
}

export default function CourseFilters({
  filters,
  onFiltersChange,
  onReset, // <-- Accept the reset function
}: CourseFiltersProps) {
  const { data: courses = [] } = useQuery<any[]>({
    queryKey: ["/api/courses"],
  });

  const uniqueFaculties = Array.from(
    new Set(courses.map((course) => course.faculty).filter(Boolean))
  );
  const faculties = ["All Faculties", ...uniqueFaculties];

  const uniqueLevels = Array.from(
    new Set(courses.map((course) => course.level).filter(Boolean))
  );
  const levels = ["All Levels", ...uniqueLevels];

  const uniqueIeltsScores = Array.from(
    new Set(courses.map((course) => course.ieltsOverall).filter(Boolean))
  );
  const ieltsScores = ["All IELTS Scores", ...uniqueIeltsScores];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
        <div className="lg:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={filters.faculty}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, faculty: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Faculty" />
          </SelectTrigger>
          <SelectContent>
            {faculties.map((faculty) => (
              <SelectItem key={faculty} value={faculty}>
                {faculty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.level}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, level: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.ieltsScore}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, ieltsScore: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="IELTS Score" />
          </SelectTrigger>
          <SelectContent>
            {ieltsScores.map((score) => (
              <SelectItem key={score} value={score}>
                {score}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button - placed BELOW filters */}
{onReset && (
    <div className="lg:col-span-1 flex items-end justify-end">
      <Button
        onClick={onReset}
        className="w-full bg-primary text-white hover:bg-blue-700 transition duration-200"
      >
        🔄 Reset Filters
      </Button>
    </div>
  )}
</div>