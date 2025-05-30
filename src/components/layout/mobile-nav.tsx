import { GraduationCap, Heart, Users, FileText, BarChart3 } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const navItems = [
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "counselors", label: "Counsellors", icon: Users },
    { id: "apply", label: "Apply", icon: FileText },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                activeTab === item.id 
                  ? "text-primary bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="text-lg mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
