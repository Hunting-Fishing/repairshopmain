
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThemeContextType {
  isModernTheme: boolean;
  toggleTheme: (checked: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [isModernTheme, setIsModernTheme] = useState(false);

  useEffect(() => {
    if (userId) {
      const loadThemePreference = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme_preference')
            .eq('id', userId)
            .single();

          if (error) throw error;
          
          if (data) {
            setIsModernTheme(data.theme_preference === 'modern');
          }
        } catch (error) {
          console.error('Error loading theme preference:', error);
          toast.error('Failed to load theme preference');
        }
      };

      loadThemePreference();
    }
  }, [userId]);

  const toggleTheme = async (checked: boolean) => {
    if (!userId) return;

    try {
      setIsModernTheme(checked);
      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: checked ? 'modern' : 'basic' })
        .eq('id', userId);

      if (error) throw error;

      toast.success("Theme preference saved");
    } catch (error) {
      console.error('Error saving theme preference:', error);
      toast.error("Failed to save theme preference");
      setIsModernTheme(!checked); // Revert on error
    }
  };

  return (
    <ThemeContext.Provider value={{ isModernTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
