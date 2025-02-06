
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      return profile;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[100px] w-full" />;
  }

  if (!userProfile || !allowedRoles.includes(userProfile.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
