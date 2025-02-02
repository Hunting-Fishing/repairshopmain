import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("@/pages/Index"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const CalendarSettings = lazy(() => import("@/pages/Calendar-Settings"));
const Customers = lazy(() => import("@/pages/Customers"));
const CustomerDetail = lazy(() => import("@/pages/CustomerDetail"));
const CustomerManagement = lazy(() => import("@/pages/CustomerManagement"));
const Staff = lazy(() => import("@/pages/Staff"));
const WorkOrders = lazy(() => import("@/pages/WorkOrders"));
const ApplicationControl = lazy(() => import("@/pages/ApplicationControl"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
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
    path: "/customer-management",
    element: <CustomerManagement />,
  },
  {
    path: "/staff",
    element: <Staff />,
  },
  {
    path: "/work-orders",
    element: <WorkOrders />,
  },
  {
    path: "/application-control",
    element: <ApplicationControl />,
  },
];