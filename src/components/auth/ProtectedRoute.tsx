
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session } = useAuth();
  const location = useLocation();
  const { data: profile, isLoading, error } = useProfile(session?.user?.id);

  if (!session) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading profile:', error);
    toast.error('Failed to load your profile');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            There was an error loading your profile. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (allowedRoles && (!profile?.role || !allowedRoles.includes(profile.role))) {
    toast.error('You don\'t have permission to access this page');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    }>
      {children}
    </Suspense>
  );
}
