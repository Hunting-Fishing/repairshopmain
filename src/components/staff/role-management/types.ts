
export function getRoleBadgeColor(role: string) {
  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 hover:bg-purple-200 text-purple-800",
    manager: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    service_advisor: "bg-green-100 hover:bg-green-200 text-green-800",
    technician: "bg-orange-100 hover:bg-orange-200 text-orange-800",
    admin: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  };

  return roleColors[role] || "bg-gray-100 hover:bg-gray-200 text-gray-800";
}

export const roles = [
  { id: "owner", name: "Owner", description: "Full system access" },
  { id: "manager", name: "Manager", description: "Manage operations" },
  { id: "service_advisor", name: "Service Advisor", description: "Handles customers" },
  { id: "technician", name: "Technician", description: "Performs repairs" },
  { id: "admin", name: "Office Admin", description: "Administrative work" },
];
