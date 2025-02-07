
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role, theme_preference')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const [isModernTheme, setIsModernTheme] = useState(false);

  // Initialize theme from profile data
  useEffect(() => {
    if (profile?.theme_preference) {
      setIsModernTheme(profile.theme_preference === 'modern');
    }
  }, [profile]);

  const handleThemeChange = async (checked: boolean) => {
    if (!session?.user?.id) return;

    setIsModernTheme(checked);
    const { error } = await supabase
      .from('profiles')
      .update({ theme_preference: checked ? 'modern' : 'basic' })
      .eq('id', session.user.id);

    if (error) {
      toast.error("Failed to save theme preference");
      setIsModernTheme(!checked); // Revert on error
      return;
    }

    await refetchProfile();
    toast.success("Theme preference saved");
  };

  // If not authenticated, redirect to auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Format role for display
  const formatRole = (role: string) => {
    return role?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Apply theme classes to the root layout
  const modernClass = isModernTheme 
    ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50' 
    : '';

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background ${modernClass}`}>
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Welcome! {profile?.first_name} {profile?.last_name}{' '}
                    {profile?.role && `: ${formatRole(profile.role)}`}
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="global-theme-toggle" className="text-sm font-medium">
                    {isModernTheme ? "Modern" : "Basic"} Theme
                  </Label>
                  <Switch
                    id="global-theme-toggle"
                    checked={isModernTheme}
                    onCheckedChange={handleThemeChange}
                    className="data-[state=checked]:bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"
                  />
                </div>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
