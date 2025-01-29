import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Mail, CreditCard, MessageSquare } from "lucide-react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "not_connected";
  onConnect: () => void;
}

const IntegrationCard = ({ title, description, icon, status, onConnect }: IntegrationCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="p-2 bg-secondary rounded-lg">{icon}</div>
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

export function IntegrationsTab() {
  const integrations = [
    {
      title: "Zapier",
      description: "Automate workflows by connecting with thousands of apps",
      icon: <Zap className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect to Zapier"),
    },
    {
      title: "Email Service",
      description: "Send automated emails and notifications",
      icon: <Mail className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Email Service"),
    },
    {
      title: "Payment Gateway",
      description: "Process payments securely",
      icon: <CreditCard className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Payment Gateway"),
    },
    {
      title: "Chat Support",
      description: "Integrate customer support chat functionality",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Chat Support"),
    },
  ];

  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.title} {...integration} />
      ))}
    </div>
  );
}