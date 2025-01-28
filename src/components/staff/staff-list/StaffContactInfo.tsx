import { Mail, Phone } from "lucide-react";

interface StaffContactInfoProps {
  email: string;
  phoneNumber: string | null;
}

export function StaffContactInfo({ email, phoneNumber }: StaffContactInfoProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <a
          href={`mailto:${email}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          {email}
        </a>
      </div>
      {phoneNumber && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a
            href={`tel:${phoneNumber}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {phoneNumber}
          </a>
        </div>
      )}
    </div>
  );
}