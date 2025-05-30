import { GraduationCap, Heart, Users, FileText, BarChart3, LogOut } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems = [
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "counselors", label: "Counsellors", icon: Users },
    { id: "apply", label: "Apply", icon: FileText },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Study in UK</h1>
            <p className="text-sm text-gray-500">Bangladesh</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start space-x-3 h-12",
                  activeTab === item.id && "bg-blue-50 text-primary hover:bg-blue-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t">
          <Button
            variant="outline"
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
