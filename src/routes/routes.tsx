
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
import { SetPassword } from "@/pages/SetPassword";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ShopList } from "@/components/shops/ShopList";
import { VehicleList } from "@/components/customers/vehicles/VehicleList";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CommunicationsTab } from "@/components/application-control/communications/CommunicationsTab";
import { InventorySuppliers } from "@/components/application-control/inventory/InventorySuppliers";

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
        element: <ProtectedRoute><Calendar /></ProtectedRoute>,
      },
      {
        path: "calendar/settings",
        element: <ProtectedRoute allowedRoles={['owner', 'management']}><CalendarSettings /></ProtectedRoute>,
      },
      {
        path: "customers",
        element: <ProtectedRoute><Customers /></ProtectedRoute>,
      },
      {
        path: "customers/:id",
        element: <ProtectedRoute><CustomerDetail /></ProtectedRoute>,
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
        element: <ProtectedRoute><VehicleList /></ProtectedRoute>,
      },
      {
        path: "work-orders",
        element: <ProtectedRoute><WorkOrders /></ProtectedRoute>,
      },
      {
        path: "shop-items",
        element: <ProtectedRoute><ShopItems /></ProtectedRoute>,
      },
      {
        path: "repair-jobs/:id",
        element: <ProtectedRoute><RepairJobDetails /></ProtectedRoute>,
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
            path: "calendar-settings",
            element: <CalendarSettings />,
          },
          {
            path: "communications",
            element: <CommunicationsTab />,
          },
          {
            path: "shops",
            element: <ShopList />,
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
      {
        path: "inventory",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']}><Inventory /></ProtectedRoute>,
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
    path: "*",
    element: <NotFoundPage />,
  }
]);
