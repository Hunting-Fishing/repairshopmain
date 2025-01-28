import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PAST_APPOINTMENT_COLORS = [
  "#8B5CF6", // Vivid Purple (Primary)
  "#22c55e", // Bright Green
  "#16a34a", // Forest Green
  "#15803d", // Deep Green
  "#eab308", // Golden Yellow
  "#facc15", // Bright Yellow
  "#fbbf24", // Warm Yellow
  "#dc2626", // Bright Red
  "#ef4444", // Vibrant Red
  "#b91c1c", // Deep Red
  "#3B82F6", // Bright Blue
  "#F97316", // Bright Orange
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