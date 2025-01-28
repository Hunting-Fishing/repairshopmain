import { UserCircle, PencilIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type StaffMember, type CustomRole, roles, getRoleBadgeColor } from "./types";

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
      <div className="flex items-center space-x-4">
        <UserCircle className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">
            {member.first_name} {member.last_name}
          </p>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Select
                defaultValue={member.role}
                onValueChange={(value: StaffMember["role"]) => {
                  if (value === 'custom') {
                    // If custom is selected, show another select for custom roles
                    return;
                  }
                  onRoleChange(value);
                }}
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
              {member.role === 'custom' && (
                <Select
                  defaultValue={member.custom_role_id || undefined}
                  onValueChange={(value: string) => {
                    onRoleChange('custom', value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select custom role" />
                  </SelectTrigger>
                  <SelectContent>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge className={getRoleBadgeColor(member.role)}>
                {displayRole}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}