
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
      supabase
        .from('profiles')
        .select('theme_preference')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setIsModernTheme(data.theme_preference === 'modern');
          }
        });
    }
  }, [userId]);

  const toggleTheme = async (checked: boolean) => {
    if (!userId) return;

    setIsModernTheme(checked);
    const { error } = await supabase
      .from('profiles')
      .update({ theme_preference: checked ? 'modern' : 'basic' })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to save theme preference");
      setIsModernTheme(!checked); // Revert on error
      return;
    }

    toast.success("Theme preference saved");
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

