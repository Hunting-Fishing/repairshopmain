import { Navigate, RouteObject } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Customers from "@/pages/Customers";
import WorkOrders from "@/pages/WorkOrders";
import Calendar from "@/pages/Calendar";
import CalendarSettings from "@/pages/Calendar-Settings";
import IndexPage from "@/pages/Index";
import Auth from "@/pages/Auth";
import ApplicationControl from "@/pages/ApplicationControl";
import Staff from "@/pages/Staff";
import CustomerManagement from "@/pages/CustomerManagement";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const protectedLayout = (Component: React.ComponentType) => (
  <ProtectedRoute>
    <AppLayout>
      <Component />
    </AppLayout>
  </ProtectedRoute>
);

export const routes: RouteObject[] = [
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/",
    element: protectedLayout(IndexPage)
  },
  {
    path: "/dashboard",
    element: protectedLayout(DashboardLayout)
  },
  {
    path: "/customers",
    element: protectedLayout(Customers)
  },
  {
    path: "/customer-management",
    element: protectedLayout(CustomerManagement)
  },
  {
    path: "/work-orders",
    element: protectedLayout(WorkOrders)
  },
  {
    path: "/calendar",
    element: protectedLayout(Calendar)
  },
  {
    path: "/calendar-settings",
    element: protectedLayout(CalendarSettings)
  },
  {
    path: "/staff",
    element: protectedLayout(Staff)
  },
  {
    path: "/application-control",
    element: protectedLayout(ApplicationControl)
  }
];