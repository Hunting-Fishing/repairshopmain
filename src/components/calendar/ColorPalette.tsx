import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const PAST_APPOINTMENT_COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#F2FCE2", // Soft Green
  "#FEC6A1", // Soft Orange
];

export function ColorPalette({ selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background/95 sticky top-0 z-10 border-b">
      <span className="text-sm font-medium">Past appointments color:</span>
      <div className="flex gap-2">
        {PAST_APPOINTMENT_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              "w-6 h-6 rounded-full border-2",
              selectedColor === color ? "border-primary" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
}

export { PAST_APPOINTMENT_COLORS };