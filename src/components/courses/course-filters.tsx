import { Search } from “@/lib/icons”;
import { Input } from “@/components/ui/input”;
import { Button } from “@/components/ui/button”;
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from “@/components/ui/select”;
import { useQuery } from “@tanstack/react-query”;

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
onReset?: () => void;
}

export default function CourseFilters({
filters,
onFiltersChange,
onReset,
}: CourseFiltersProps) {
const { data: courses = [] } = useQuery<any[]>({
queryKey: [”/api/courses”],
});

const uniqueFaculties = Array.from(
new Set(courses.map((course) => course.faculty).filter(Boolean))
);
const faculties = [“All Faculties”, …uniqueFaculties];

const uniqueLevels = Array.from(
new Set(courses.map((course) => course.level).filter(Boolean))
);
const levels = [“All Levels”, …uniqueLevels];

const uniqueIeltsScores = Array.from(
new Set(courses.map((course) => course.ieltsOverall).filter(Boolean))
);
const ieltsScores = [“All IELTS Scores”, …uniqueIeltsScores];

return (





<Input
type=“text”
placeholder=“Search courses…”
value={filters.search}
onChange={(e) =>
onFiltersChange({ …filters, search: e.target.value })
}
className=“pl-10”
/>



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

  {onReset && (
    <div className="mt-4 flex justify-end">
      <Button
        onClick={onReset}
        className="bg-primary text-white hover:bg-blue-700 transition duration-200"
      >
        🔄 Reset Filters
      </Button>
    </div>
  )}
</div>

);
}