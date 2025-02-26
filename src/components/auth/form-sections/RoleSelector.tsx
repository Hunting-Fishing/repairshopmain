
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = ['admin', 'moderator', 'user'] as const;
export type UserRole = typeof ROLES[number];

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (value: UserRole) => void;
}

export function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="role" className="text-sm font-medium">
        Role
      </label>
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
