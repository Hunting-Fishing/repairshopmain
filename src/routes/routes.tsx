
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import CalendarSettings from "@/pages/Calendar-Settings";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import CustomerManagement from "@/pages/CustomerManagement";
import Staff from "@/pages/Staff";
import WorkOrders from "@/pages/WorkOrders";
import RepairJobDetails from "@/pages/RepairJobDetails";
import ApplicationControl from "@/pages/ApplicationControl";
import Inventory from "@/pages/Inventory";
import JobTemplates from "@/pages/JobTemplates";
import ShopItems from "@/pages/ShopItems";
import Vehicles from "@/pages/Vehicles";
import Shops from "@/pages/Shops";
import Communications from "@/pages/Communications";
import InventorySuppliers from "@/pages/InventorySuppliers";
import { SetPassword } from "@/pages/SetPassword";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { AlertsDashboard } from "@/components/application-control/AlertsDashboard";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Define route types for better organization
const ROUTE_TYPES = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  ADMIN: 'admin'
} as const;

// Define route configurations with proper typing
type RouteConfig = {
  path: string;
  element: JSX.Element;
  allowedRoles?: string[];
  children?: RouteConfig[];
};

// Helper function to wrap routes with proper protection
const wrapRoute = (config: RouteConfig) => {
  if (config.allowedRoles) {
    return (
      <ProtectedRoute allowedRoles={config.allowedRoles}>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {config.element}
          </Suspense>
        </ErrorBoundary>
      </ProtectedRoute>
    );
  }
  return config.element;
};

// Main route configurations
const routes: RouteConfig[] = [
  {
    path: "/",
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      {
        path: "",
        element: <Index />,
        allowedRoles: ['owner', 'management', 'service_advisor', 'technician']
      },
      {
        path: "alerts",
        element: <AlertsDashboard />,
        allowedRoles: ['owner', 'management']
      },
      {
        path: "calendar",
        element: <Calendar />,
        allowedRoles: ['owner', 'management', 'service_advisor', 'technician']
      },
      {
        path: "calendar/settings",
        element: <CalendarSettings />,
        allowedRoles: ['owner', 'management']
      },
      {
        path: "customers",
        element: <Customers />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "customers/:id",
        element: <CustomerDetail />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "customer-management",
        element: <CustomerManagement />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "staff",
        element: <Staff />,
        allowedRoles: ['owner', 'management']
      },
      {
        path: "vehicles",
        element: <Vehicles />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "work-orders",
        element: <WorkOrders />,
        allowedRoles: ['owner', 'management', 'service_advisor', 'technician']
      },
      {
        path: "shop-items",
        element: <ShopItems />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "repair-jobs/:id",
        element: <RepairJobDetails />,
        allowedRoles: ['owner', 'management', 'service_advisor', 'technician']
      },
      {
        path: "inventory",
        element: <Inventory />,
        allowedRoles: ['owner', 'management', 'service_advisor']
      },
      {
        path: "application-control",
        element: <Outlet />,
        allowedRoles: ['owner', 'management'],
        children: [
          {
            path: "",
            element: <ApplicationControl />
          },
          {
            path: "communications",
            element: <Communications />
          },
          {
            path: "shops",
            element: <Shops />
          },
          {
            path: "job-templates",
            element: <JobTemplates />
          },
          {
            path: "inventory/suppliers",
            element: <InventorySuppliers />
          }
        ]
      }
    ]
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/auth/set-password",
    element: <SetPassword />
  },
  {
    path: "/auth/verify-email",
    element: <EmailVerification />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

// Create router with processed routes
const processRoutes = (routeConfigs: RouteConfig[]): RouteConfig[] => {
  return routeConfigs.map(config => ({
    ...config,
    element: wrapRoute(config),
    children: config.children ? processRoutes(config.children) : undefined
  }));
};

export const router = createBrowserRouter(processRoutes(routes));
