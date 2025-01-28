import { UserCircle, PencilIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type StaffMember, roles, getRoleBadgeColor } from "./types";

interface StaffMemberRowProps {
  member: StaffMember;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onRoleChange: (role: StaffMember["role"]) => void;
}

export function StaffMemberRow({ 
  member, 
  isEditing, 
  onEdit, 
  onCancelEdit, 
  onRoleChange 
}: StaffMemberRowProps) {
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
                onValueChange={(value: StaffMember["role"]) => onRoleChange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {member.role.replace("_", " ").toUpperCase()}
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