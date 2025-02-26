
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CustomRole } from '../types';

interface CustomRoleSelectProps {
  customRoles: CustomRole[];
  defaultValue?: string;
  onRoleChange: (roleId: string) => void;
}

export function CustomRoleSelect({ 
  customRoles, 
  defaultValue, 
  onRoleChange 
}: CustomRoleSelectProps) {
  return (
    <Select 
      defaultValue={defaultValue} 
      onValueChange={onRoleChange}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select custom role" />
      </SelectTrigger>
      <SelectContent>
        {customRoles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
