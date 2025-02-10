
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session } = useAuth();
  const location = useLocation();
  const { data: profile, isLoading } = useProfile(session?.user?.id);

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (allowedRoles && (!profile?.role || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
