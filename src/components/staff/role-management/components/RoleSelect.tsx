import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type StaffMember, roles } from "../types";

interface RoleSelectProps {
  defaultValue: string;
  onRoleChange: (role: StaffMember["role"]) => void;
}

export function RoleSelect({ defaultValue, onRoleChange }: RoleSelectProps) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value: StaffMember["role"]) => onRoleChange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role === 'custom' ? 'CUSTOM ROLES' : role.replace("_", " ").toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}