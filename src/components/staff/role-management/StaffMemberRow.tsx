import { PencilIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type StaffMember, type CustomRole, getRoleBadgeColor } from "./types";
import { RoleSelect } from "./components/RoleSelect";
import { CustomRoleSelect } from "./components/CustomRoleSelect";
import { StaffMemberInfo } from "./components/StaffMemberInfo";

interface StaffMemberRowProps {
  member: StaffMember;
  customRoles: CustomRole[];
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onRoleChange: (role: StaffMember["role"], customRoleId?: string) => void;
}

export function StaffMemberRow({ 
  member, 
  customRoles,
  isEditing, 
  onEdit, 
  onCancelEdit, 
  onRoleChange 
}: StaffMemberRowProps) {
  const displayRole = member.role === 'custom' && member.custom_role_id
    ? customRoles.find(r => r.id === member.custom_role_id)?.name || 'Custom Role'
    : member.role.replace("_", " ").toUpperCase();

  return (
    <div className="flex items-center justify-between">
      <StaffMemberInfo member={member} />
      <div>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <RoleSelect 
              defaultValue={member.role} 
              onRoleChange={(role) => {
                if (role !== 'custom') onRoleChange(role);
              }} 
            />
            {member.role === 'custom' && (
              <CustomRoleSelect
                customRoles={customRoles}
                defaultValue={member.custom_role_id || undefined}
                onRoleChange={(roleId) => onRoleChange('custom', roleId)}
              />
            )}
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Badge className={getRoleBadgeColor(member.role)}>
              {displayRole}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}