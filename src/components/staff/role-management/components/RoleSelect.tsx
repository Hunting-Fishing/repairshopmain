
import React from 'react';
import { StaffMember, roles } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleSelectProps {
  defaultValue: string;
  onRoleChange: (role: string) => void;
}

export function RoleSelect({ defaultValue, onRoleChange }: RoleSelectProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onRoleChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role.replace('_', ' ')}
          </SelectItem>
        ))}
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
