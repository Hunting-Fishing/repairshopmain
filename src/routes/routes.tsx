import { createBrowserRouter, Outlet } from "react-router-dom";
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
import ApplicationControl from "@/pages/ApplicationControl";
import Inventory from "@/pages/Inventory";
import { InventorySuppliers } from "@/components/application-control/inventory/InventorySuppliers";

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
        path: "work-orders",
        element: <WorkOrders />,
      },
      {
        path: "application-control",
        element: <ApplicationControl />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "inventory/suppliers",
        element: <InventorySuppliers />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);