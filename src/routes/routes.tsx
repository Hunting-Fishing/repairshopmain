import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Calendar from "@/pages/Calendar";
import CalendarSettings from "@/pages/Calendar-Settings";
import Staff from "@/pages/Staff";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import CustomerManagement from "@/pages/CustomerManagement";
import WorkOrders from "@/pages/WorkOrders";
import ApplicationControl from "@/pages/ApplicationControl";
import Inventory from "@/pages/Inventory";

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/calendar/settings",
    element: <CalendarSettings />,
  },
  {
    path: "/staff",
    element: <Staff />,
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
    path: "/customer-management",
    element: <CustomerManagement />,
  },
  {
    path: "/work-orders",
    element: <WorkOrders />,
  },
  {
    path: "/application-control",
    element: <ApplicationControl />,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
];

export const router = createBrowserRouter(routes);