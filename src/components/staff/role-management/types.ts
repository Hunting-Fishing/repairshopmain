
export const roles = [
  'hr',
  'service_advisor',
  'technician',
  'custom',
  'management',
  'parts'
] as const;

export type SystemRole = 'hr' | 'service_advisor' | 'technician' | 'custom' | 'management' | 'parts' | 'owner' | 'manager' | 'admin';

export type CustomRole = {
  id: string;
  name: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[];
};

// Import StaffMember type from the main types file
import { StaffMember } from "@/types/staff";
// Re-export for components that import from this file
export type { StaffMember };

// Create a utility function to get badge colors based on role
export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'owner':
      return "bg-purple-100 text-purple-800 border-purple-300";
    case 'manager':
      return "bg-blue-100 text-blue-800 border-blue-300";
    case 'admin':
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case 'hr':
      return "bg-pink-100 text-pink-800 border-pink-300";
    case 'service_advisor':
      return "bg-green-100 text-green-800 border-green-300";
    case 'technician':
      return "bg-amber-100 text-amber-800 border-amber-300";
    case 'management':
      return "bg-cyan-100 text-cyan-800 border-cyan-300";
    case 'parts':
      return "bg-orange-100 text-orange-800 border-orange-300";
    case 'custom':
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}
