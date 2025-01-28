export type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "owner" | "management" | "technician" | "service_advisor" | "parts" | "hr" | "custom";
};

export const roles: StaffMember["role"][] = [
  "owner",
  "management",
  "technician",
  "service_advisor",
  "parts",
  "hr",
];

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-purple-500";
    case "management":
      return "bg-blue-500";
    case "technician":
      return "bg-green-500";
    case "service_advisor":
      return "bg-yellow-500";
    case "parts":
      return "bg-orange-500";
    case "hr":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};