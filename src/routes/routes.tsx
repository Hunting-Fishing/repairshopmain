import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Calendar from "@/pages/Calendar";
import CalendarSettings from "@/pages/Calendar-Settings";
import Staff from "@/pages/Staff";
import Customers from "@/pages/Customers";
import { CustomerDetail } from "@/pages/CustomerDetail";
import WorkOrders from "@/pages/WorkOrders";
import ApplicationControl from "@/pages/ApplicationControl";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
        path: "staff",
        element: <Staff />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "customers/:customerId",
        element: <CustomerDetail />,
      },
      {
        path: "work-orders",
        element: <WorkOrders />,
      },
      {
        path: "application-control",
        element: <ApplicationControl />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);