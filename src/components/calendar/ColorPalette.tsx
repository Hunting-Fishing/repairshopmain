
import { cn } from "@/lib/utils";

export const PAST_APPOINTMENT_COLORS = [
  "#808080", // Gray
  "#C0C0C0", // Silver
  "#D3D3D3", // Light gray
];

interface ColorPaletteProps {
  selectedColors: [string, string];
  onColorSelect: (colors: [string, string]) => void;
  activeColorIndex: 0 | 1;
  onActiveColorChange: (index: 0 | 1) => void;
}

export const DISTINCT_COLORS = [
  "#000000", // Black
  "#808080", // Gray
  "#FFFFFF", // White
  "#8B4513", // Brown
  "#FFA500", // Orange
  "#FFFF00", // Yellow
  "#008000", // Green
  "#808000", // Olive
  "#DAA520", // Mustard
  "#008080", // Teal
  "#00FFFF", // Cyan
  "#87CEEB", // Light blue
  "#0000FF", // Blue
  "#000080", // Dark blue
  "#800000", // Maroon
  "#FF0000", // Red
  "#800080", // Purple
  "#FF00FF", // Magenta
  "#FFC0CB", // Pink
  "#FFD700", // Gold
  "#C0C0C0", // Silver
];

export function ColorPalette({ 
  selectedColors, 
  onColorSelect,
  activeColorIndex,
  onActiveColorChange
}: ColorPaletteProps) {
  const handleColorSelect = (color: string) => {
    const newColors: [string, string] = [...selectedColors] as [string, string];
    newColors[activeColorIndex] = color;
    onColorSelect(newColors);
  };

  return (
    <div className="space-y-4 p-4 bg-background/95 rounded-lg border border-[#F97316]">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm font-medium">Select colors:</span>
        <div className="flex gap-2">
          <button
            className={cn(
              "w-8 h-8 rounded-l-full border-2 transition-transform",
              activeColorIndex === 0 ? "border-[#F97316] scale-110" : "border-transparent"
            )}
            style={{ 
              background: `linear-gradient(135deg, ${selectedColors[0]} 50%, transparent 50%)`,
            }}
            onClick={() => onActiveColorChange(0)}
            title="Primary Color"
          />
          <button
            className={cn(
              "w-8 h-8 rounded-r-full border-2 transition-transform",
              activeColorIndex === 1 ? "border-[#F97316] scale-110" : "border-transparent"
            )}
            style={{ 
              background: `linear-gradient(315deg, ${selectedColors[1]} 50%, transparent 50%)`,
            }}
            onClick={() => onActiveColorChange(1)}
            title="Secondary Color"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {DISTINCT_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
              selectedColors.includes(color) ? "border-[#F97316]" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
