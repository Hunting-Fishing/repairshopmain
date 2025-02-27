
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ControlPanel } from "@/components/application-control/ControlPanel";
import { OverviewTab } from "@/components/application-control/OverviewTab";
import { CustomerControl } from "@/components/application-control/CustomerControl";
import { AlertsDashboard } from "@/components/application-control/AlertsDashboard";
import { InventoryTab } from "@/components/application-control/inventory/InventoryTab";
import { CommunicationsTab } from "@/components/application-control/communications/CommunicationsTab";
import { IntegrationsTab } from "@/components/application-control/IntegrationsTab";
import { DatabaseTab } from "@/components/application-control/database/DatabaseTab";

// Lazy-loaded components
const SystemStatus = lazy(() => import("@/components/application-control/SystemStatus"));

export default function ApplicationControl() {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Application Control</h1>
              <p className="text-muted-foreground">
                Manage your application settings and configurations
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2">
            <nav className="flex space-x-2">
              <Link 
                to="/application-control" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === "/application-control" ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Overview
              </Link>
              <Link 
                to="/application-control/customers" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/customers") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Customers
              </Link>
              <Link 
                to="/application-control/inventory" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/inventory") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Inventory
              </Link>
              <Link 
                to="/application-control/database" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/database") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Database
              </Link>
              <Link 
                to="/application-control/communications" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/communications") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Communications
              </Link>
              <Link 
                to="/application-control/alerts" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/alerts") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Alerts
              </Link>
              <Link 
                to="/application-control/integrations" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/integrations") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Integrations
              </Link>
              <Link 
                to="/application-control/security" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname.includes("/security") ? 
                  "bg-primary text-primary-foreground" : 
                  "text-muted-foreground hover:bg-muted"}`}
              >
                Security
              </Link>
            </nav>
          </div>
          
          <Suspense fallback={<ControlPanel />}>
            <Routes>
              <Route path="/" element={<OverviewTab />} />
              <Route path="/customers" element={<CustomerControl />} />
              <Route path="/inventory/*" element={<InventoryTab />} />
              <Route path="/database/*" element={<DatabaseTab />} />
              <Route path="/communications/*" element={<CommunicationsTab />} />
              <Route path="/alerts" element={<AlertsDashboard />} />
              <Route path="/integrations/*" element={<IntegrationsTab />} />
              <Route path="/security" element={<SystemStatus />} />
              <Route path="*" element={<Navigate to="/application-control" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
