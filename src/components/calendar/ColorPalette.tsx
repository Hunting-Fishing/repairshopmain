
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

  const handleColorSelect = async () => {
    if (!session?.user) {
      console.log("No user session found");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          color_preferences: {
            primary_color: PAST_APPOINTMENT_COLORS[0],
            secondary_color: PAST_APPOINTMENT_COLORS[1],
            border_color: PAST_APPOINTMENT_COLORS[0],
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
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Calendar Color Scheme:</span>
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

