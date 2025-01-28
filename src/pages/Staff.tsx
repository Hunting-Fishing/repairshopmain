import { TechnicianManagement } from "@/components/staff/TechnicianManagement";

export default function Staff() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your technicians and their settings
        </p>
      </div>
      
      <TechnicianManagement />
    </div>
  );
}