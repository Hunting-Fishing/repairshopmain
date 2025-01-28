import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PAST_APPOINTMENT_COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#0EA5E9", // Ocean Blue
  "#33C3F0", // Sky Blue
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#F1F0FB", // Soft Gray
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
];

export function ColorPalette({ selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-background/95 rounded-lg border border-[#FEC6A1]">
      <span className="text-sm font-medium mb-2 w-full">Select color:</span>
      <div className="flex flex-wrap gap-2">
        {PAST_APPOINTMENT_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
              selectedColor === color ? "border-[#FEC6A1]" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color} // Added tooltip for accessibility
          />
        ))}
      </div>
    </div>
  );
}

export { PAST_APPOINTMENT_COLORS };