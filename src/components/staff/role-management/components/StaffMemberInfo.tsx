
import React from 'react';
import { StaffMember } from '../types';

interface StaffMemberInfoProps {
  member: StaffMember;
}

export function StaffMemberInfo({ member }: StaffMemberInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="font-medium">{member.first_name} {member.last_name}</div>
      <div className="text-sm text-muted-foreground">{member.email}</div>
    </div>
  );
}
