
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PAST_APPOINTMENT_COLORS = [
  "#FF0000", // Bright Red
  "#00FF00", // Bright Green
  "#0000FF", // Bright Blue
  "#FFD700", // Gold
  "#FF1493", // Deep Pink
  "#00FFFF", // Cyan
  "#800080", // Purple
  "#FFA500", // Orange
  "#000000", // Black
  "#808080", // Gray
  "#8B4513", // Saddle Brown
  "#4B0082", // Indigo
  "#006400", // Dark Green
];

export function ColorPalette({ selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-background/95 rounded-lg border border-[#F97316]">
      <span className="text-sm font-medium mb-2 w-full">Select color:</span>
      <div className="flex flex-wrap gap-2">
        {PAST_APPOINTMENT_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
              selectedColor === color ? "border-[#F97316]" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
