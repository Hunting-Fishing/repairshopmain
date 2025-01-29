import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "not_connected";
  onConnect: () => void;
}

export const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  status, 
  onConnect 
}: IntegrationCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="p-2 bg-secondary rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${status === 'connected' ? 'text-green-500' : 'text-gray-500'}`}>
          {status === 'connected' ? 'Connected' : 'Not Connected'}
        </span>
        <Button variant={status === 'connected' ? 'outline' : 'default'} onClick={onConnect}>
          {status === 'connected' ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </CardHeader>
  </Card>
);