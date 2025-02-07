
import { cn } from "@/lib/utils";

export const PAST_APPOINTMENT_COLORS = [
  "#ea384c", // Red (default)
  "#0EA5E9", // Ocean Blue (default)
] as const;

interface ColorPaletteProps {
  selectedColors: [string, string];
  onColorSelect: (colors: [string, string]) => void;
  activeColorIndex: 0 | 1;
  onActiveColorChange: (index: 0 | 1) => void;
}

export function ColorPalette({ 
  selectedColors, 
  onColorSelect,
  activeColorIndex,
  onActiveColorChange
}: ColorPaletteProps) {
  return (
    <div className="space-y-4 p-4 bg-background/95 rounded-lg border">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Calendar Colors are managed in Application Control</span>
      </div>
    </div>
  );
}

