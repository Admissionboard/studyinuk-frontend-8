import { Plus } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onQuickApply: () => void;
}

export default function FloatingActionButton({ onQuickApply }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onQuickApply}
      className="fixed bottom-24 right-6 md:bottom-6 w-14 h-14 rounded-full shadow-lg bg-secondary hover:bg-green-700 text-white z-40 transition-all duration-200 hover:scale-110"
      size="sm"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
