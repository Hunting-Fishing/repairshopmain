import { LucideIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IntegrationStatus } from "./IntegrationStatus";

interface IntegrationHeaderProps {
  title: string;
  Icon: LucideIcon;
  status: "connected" | "not_connected";
  onManage: () => void;
}

export const IntegrationHeader = ({ title, Icon, status, onManage }: IntegrationHeaderProps) => (
  <div className="flex items-center justify-between">
    <CardTitle className="text-xl">{title}</CardTitle>
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