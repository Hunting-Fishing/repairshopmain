import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isSaving, setIsSaving] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const handleColorSelect = async (color: string) => {
    if (!session?.user) {
      console.log("No user session found");
      return;
    }

    const newColors: [string, string] = [...selectedColors] as [string, string];
    newColors[activeColorIndex] = color;
    onColorSelect(newColors);

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          color_preferences: {
            primary_color: newColors[0],
            secondary_color: newColors[1],
            border_color: newColors[0],
            background_color: 'bg-background/95'
          }
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('Error saving color preferences:', error);
        toast.error('Failed to save color preferences');
      }
    } catch (error) {
      console.error('Error saving color preferences:', error);
      toast.error('Failed to save color preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-background/95 rounded-lg border">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm font-medium">Select colors:</span>
        <div className="flex gap-2">
          <button
            className={cn(
              "w-8 h-8 rounded-l-full border-2 transition-transform",
              activeColorIndex === 0 ? "border-primary scale-110" : "border-transparent"
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
              activeColorIndex === 1 ? "border-primary scale-110" : "border-transparent"
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
              selectedColors.includes(color) ? "border-primary" : "border-transparent",
              isSaving && "opacity-50 cursor-not-allowed"
            )}
            style={{ backgroundColor: color }}
            onClick={() => !isSaving && handleColorSelect(color)}
            title={color}
            disabled={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
