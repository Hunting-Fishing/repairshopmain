
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // System theme detection
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = async (e: MediaQueryListEvent | MediaQueryList) => {
      if (!userId) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('theme_preference')
          .eq('id', userId)
          .maybeSingle();

        // Only auto-switch if user hasn't set a preference
        if (!data?.theme_preference) {
          setIsModernTheme(e.matches);
        }
      } catch (error) {
        console.error('Error checking theme preference:', error);
      }
    };

    updateTheme(prefersDark);
    prefersDark.addEventListener('change', updateTheme);
    return () => prefersDark.removeEventListener('change', updateTheme);
  }, [userId]);

  // Load user theme preference
  useEffect(() => {
    if (userId) {
      const loadThemePreference = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme_preference')
            .eq('id', userId)
            .maybeSingle();

          if (error) throw error;
          
          if (data) {
            setIsTransitioning(true);
            setIsModernTheme(data.theme_preference === 'modern');
            setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
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
      setIsTransitioning(true);
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
    } finally {
      setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
    }
  };

  return (
    <ThemeContext.Provider value={{ isModernTheme, toggleTheme }}>
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
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
