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
import { InventorySuppliers } from "@/components/application-control/inventory/InventorySuppliers";
import { CommunicationsTab } from "@/components/application-control/communications/CommunicationsTab";
import { SetPassword } from "@/pages/SetPassword";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ShopList } from "@/components/shops/ShopList";
import { VehicleList } from "@/components/customers/vehicles/VehicleList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "calendar/settings",
        element: <CalendarSettings />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "customers/:id",
        element: <CustomerDetail />,
      },
      {
        path: "customer-management",
        element: <CustomerManagement />,
      },
      {
        path: "staff",
        element: <Staff />,
      },
      {
        path: "vehicles",
        element: <VehicleList />,
      },
      {
        path: "work-orders",
        element: <WorkOrders />,
      },
      {
        path: "shop-items",
        element: <ShopItems />,
      },
      {
        path: "shops",
        element: <Navigate to="/application-control/shops" replace />,
      },
      {
        path: "communications",
        element: <CommunicationsTab />,
      },
      {
        path: "application-control",
        element: <ProtectedRoute allowedRoles={['owner', 'management', 'service_advisor']} />,
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
          }
        ],
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "inventory/suppliers",
        element: <InventorySuppliers />,
      },
      {
        path: "repair-jobs/:id",
        element: <RepairJobDetails />,
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
]);
