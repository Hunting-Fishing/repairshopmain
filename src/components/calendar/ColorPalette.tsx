import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PAST_APPOINTMENT_COLORS = [
  "#8B5CF6", // Vivid Purple (Primary)
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#1A1F2C", // Dark Purple
  "#0EA5E9", // Ocean Blue
  "#3B82F6", // Bright Blue
  "#F97316", // Bright Orange
  "#FB923C", // Light Orange
  "#D946EF", // Magenta Pink
  "#9333EA", // Deep Purple
  "#6366F1", // Indigo
  "#4F46E5", // Royal Blue
  "#7C3AED", // Violet
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