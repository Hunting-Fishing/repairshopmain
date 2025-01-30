import { LucideIcon } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IntegrationStatus } from "./IntegrationStatus";

interface IntegrationHeaderProps {
  title: string;
  Icon: LucideIcon;
  status: "connected" | "not_connected";
  onManage: () => void;
  description?: string;
}

export const IntegrationHeader = ({ 
  title, 
  Icon, 
  status, 
  onManage,
  description 
}: IntegrationHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-secondary rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <IntegrationStatus status={status} />
      <Button 
        variant={status === 'connected' ? 'outline' : 'default'} 
        onClick={onManage}
      >
        {status === 'connected' ? 'Manage' : 'Connect'}
      </Button>
    </div>
  </div>
);