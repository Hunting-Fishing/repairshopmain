
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const userMetadata = session.user?.user_metadata;
  const firstName = userMetadata?.firstName || '';
  const lastName = userMetadata?.lastName || '';
  const role = userMetadata?.role || '';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Welcome! {firstName} {lastName} : {formatRole(role)}
              </div>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
