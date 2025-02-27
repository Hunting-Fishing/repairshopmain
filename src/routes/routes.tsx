
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../components/layout/RootLayout";
import { AppLayout } from "../components/layout/AppLayout";

import Index from "../pages/Index";
import Auth from "../pages/Auth";
import SetPassword from "../pages/SetPassword";
import Customers from "../pages/Customers";
import CustomerDetail from "../pages/CustomerDetail";
import CustomerPortal from "../pages/CustomerPortal";
import Calendar from "../pages/Calendar";
import CalendarSettings from "../pages/Calendar-Settings";
import Inventory from "../pages/Inventory";
import InventorySuppliers from "../pages/InventorySuppliers";
import Shops from "../pages/Shops";
import ShopItems from "../pages/ShopItems";
import ShopSettings from "../pages/ShopSettings";
import NotFoundPage from "../pages/NotFoundPage";
import WorkOrders from "../pages/WorkOrders";
import Staff from "../pages/Staff";
import Vehicles from "../pages/Vehicles";
import JobTemplates from "../pages/JobTemplates";
import RepairJobDetails from "../pages/RepairJobDetails";
import ApplicationControl from "../pages/ApplicationControl";
import Communications from "../pages/Communications";
import SystemAlerts from "../pages/SystemAlerts";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Index />,
          },
          {
            path: "/calendar",
            element: <Calendar />,
          },
          {
            path: "/calendar-settings",
            element: <CalendarSettings />,
          },
          {
            path: "/customers",
            element: <Customers />,
          },
          {
            path: "/customers/:id",
            element: <CustomerDetail />,
          },
          {
            path: "/customer-portal",
            element: <CustomerPortal />,
          },
          {
            path: "/inventory",
            element: <Inventory />,
          },
          {
            path: "/inventory/suppliers",
            element: <InventorySuppliers />,
          },
          {
            path: "/shops",
            element: <Shops />,
          },
          {
            path: "/shop/items",
            element: <ShopItems />,
          },
          {
            path: "/shop/settings",
            element: <ShopSettings />,
          },
          {
            path: "/work-orders",
            element: <WorkOrders />,
          },
          {
            path: "/staff",
            element: <Staff />,
          },
          {
            path: "/vehicles",
            element: <Vehicles />,
          },
          {
            path: "/job-templates",
            element: <JobTemplates />,
          },
          {
            path: "/repair-jobs/:id",
            element: <RepairJobDetails />,
          },
          {
            path: "/application-control",
            element: <ApplicationControl />,
          },
          {
            path: "/communications",
            element: <Communications />,
          },
          {
            path: "/system-alerts",
            element: <SystemAlerts />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
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
    ],
  },
]);
