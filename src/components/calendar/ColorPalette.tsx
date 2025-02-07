
import { cn } from "@/lib/utils";

export const PAST_APPOINTMENT_COLORS = [
  "#ea384c", // Red 
  "#0EA5E9", // Ocean Blue
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
        <span className="text-sm font-medium">Calendar Colors:</span>
        <div className="flex gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-transparent"
            style={{ backgroundColor: PAST_APPOINTMENT_COLORS[0] }}
            title="Primary Color (Past Events)"
          />
          <div
            className="w-8 h-8 rounded-full border-2 border-transparent"
            style={{ backgroundColor: PAST_APPOINTMENT_COLORS[1] }}
            title="Secondary Color (Current Events)"
          />
        </div>
      </div>
    </div>
  );
}
