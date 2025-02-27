
import React from "react";
import { StaffMemberRow } from "./StaffMemberRow";
import type { StaffMember, CustomRole } from "./types";

interface StaffListProps {
  staffMembers: StaffMember[];
  customRoles: CustomRole[];
  editingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onRoleChange: (userId: string, newRole: string, customRoleId?: string) => void;
}

export function StaffList({ 
  staffMembers, 
  customRoles, 
  editingId, 
  onEdit, 
  onCancelEdit, 
  onRoleChange 
}: StaffListProps) {
  if (!staffMembers?.length) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">No staff members found</p>
      </div>
    );
  }

  return (
    <>
      {staffMembers.map((member) => (
        <StaffMemberRow
          key={member.id}
          member={member}
          customRoles={customRoles}
          isEditing={editingId === member.id}
          onEdit={() => onEdit(member.id)}
          onCancelEdit={onCancelEdit}
          onRoleChange={(newRole, customRoleId) => {
            onRoleChange(member.id, newRole, customRoleId);
          }}
        />
      ))}
    </>
  );
}
