
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import CalendarSettings from "@/pages/Calendar-Settings";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import { CustomerManagement } from "@/pages/CustomerManagement";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout><Outlet /></AppLayout>,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Index /></ProtectedRoute>,
      },
      {
        path: "calendar",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor', 'technician']}><Calendar /></ProtectedRoute>,
      },
      {
        path: "calendar/settings",
        element: <ProtectedRoute allowedRoles={['owner', 'management']}><CalendarSettings /></ProtectedRoute>,
      },
      {
        path: "customers",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><Customers /></ProtectedRoute>,
      },
      {
        path: "customers/:id",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><CustomerDetail /></ProtectedRoute>,
      },
      {
        path: "customer-management",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><CustomerManagement /></ProtectedRoute>,
      },
      {
        path: "staff",
        element: <ProtectedRoute allowedRoles={['owner', 'management']}><Staff /></ProtectedRoute>,
      },
      {
        path: "vehicles",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><Vehicles /></ProtectedRoute>,
      },
      {
        path: "work-orders",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor', 'technician']}><WorkOrders /></ProtectedRoute>,
      },
      {
        path: "shop-items",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><ShopItems /></ProtectedRoute>,
      },
      {
        path: "repair-jobs/:id",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor', 'technician']}><RepairJobDetails /></ProtectedRoute>,
      },
      {
        path: "inventory",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><Inventory /></ProtectedRoute>,
      },
      {
        path: "application-control",
        element: <ProtectedRoute allowedRoles={['owner', 'management']}>
          <Outlet />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <ApplicationControl />,
          },
          {
            path: "communications",
            element: <Communications />,
          },
          {
            path: "shops",
            element: <Shops />,
          },
          {
            path: "job-templates",
            element: <JobTemplates />,
          },
          {
            path: "inventory/suppliers",
            element: <InventorySuppliers />,
          }
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth/set-password",
    element: <SetPassword />,
  },
  {
    path: "/auth/verify-email",
    element: <EmailVerification />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);
