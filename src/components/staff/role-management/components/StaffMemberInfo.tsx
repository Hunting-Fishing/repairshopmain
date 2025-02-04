import { UserCircle } from "lucide-react";
import type { StaffMember } from "../types";

interface StaffMemberInfoProps {
  member: StaffMember;
}

export function StaffMemberInfo({ member }: StaffMemberInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <UserCircle className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-medium">
          {member.first_name} {member.last_name}
        </p>
      </div>
    </div>
  );
}