import { UserCog } from "lucide-react";

export function TechnicianHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserCog className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Technician Management</h1>
      </div>
    </div>
  );
}