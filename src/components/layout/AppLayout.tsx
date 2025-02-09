
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, session } = useAuth();
  const { data: profile, isLoading, error } = useProfile(session?.user?.id);
  const { isModernTheme, toggleTheme } = useTheme();

  // If not authenticated, redirect to auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    throw error; // This will be caught by AuthErrorBoundary
  }

  const formatRole = (role: string) => {
    return role?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <AuthErrorBoundary>
      <SidebarProvider>
        <div className={`min-h-screen flex w-full bg-background ${
          isModernTheme ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50' : ''
        }`}>
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container py-6">
              <div className={`flex justify-between items-center mb-4 p-4 rounded-lg ${
                isModernTheme 
                  ? 'bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100/50'
                  : 'bg-background'
              }`}>
                <div className={`${
                  isModernTheme 
                    ? 'text-blue-900 font-medium'
                    : 'text-muted-foreground'
                }`}>
                  {isLoading ? (
                    <Skeleton className="h-6 w-48" />
                  ) : (
                    <>
                      Welcome! {profile?.first_name} {profile?.last_name}{' '}
                      {profile?.role && (
                        <span className={`${
                          isModernTheme 
                            ? 'text-blue-600 font-semibold'
                            : 'text-muted-foreground'
                        }`}>
                          : {formatRole(profile.role)}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor="global-theme-toggle" 
                      className={`text-sm font-medium ${
                        isModernTheme 
                          ? 'text-blue-900'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {isModernTheme ? "Modern" : "Basic"} Theme
                    </Label>
                    <Switch
                      id="global-theme-toggle"
                      checked={isModernTheme}
                      onCheckedChange={toggleTheme}
                      className={`${
                        isModernTheme 
                          ? 'data-[state=checked]:bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]'
                          : ''
                      }`}
                    />
                  </div>
                  <Button 
                    variant={isModernTheme ? "default" : "ghost"}
                    onClick={signOut}
                    className={isModernTheme ? 'bg-white/90 hover:bg-white text-blue-600' : ''}
                  >
                    <LogOut className={`mr-2 h-4 w-4 ${
                      isModernTheme ? 'text-blue-500' : ''
                    }`} />
                    Sign Out
                  </Button>
                </div>
              </div>
              <div className={`${
                isModernTheme 
                  ? 'text-blue-900'
                  : ''
              }`}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthErrorBoundary>
  );
}
