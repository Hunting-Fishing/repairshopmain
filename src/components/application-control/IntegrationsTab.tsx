import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Mail, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  Phone, 
  FileText, 
  TruckIcon, 
  BarChart, 
  MessageCircle, 
  Clock, 
  Database, 
  ShoppingCart, 
  Map, 
  Bell, 
  Printer, 
  Camera,
  Smartphone,
  Cloud,
  Wrench
} from "lucide-react";

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
    {
      title: "Calendar Sync",
      description: "Sync with Google Calendar or other calendar services",
      icon: <Calendar className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Calendar"),
    },
    {
      title: "SMS Notifications",
      description: "Send text message updates to customers",
      icon: <Phone className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect SMS"),
    },
    {
      title: "Document Management",
      description: "Store and manage digital documents securely",
      icon: <FileText className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Document Management"),
    },
    {
      title: "Parts Inventory",
      description: "Connect with parts suppliers and manage inventory",
      icon: <TruckIcon className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Parts Inventory"),
    },
    {
      title: "Analytics",
      description: "Track business performance and generate reports",
      icon: <BarChart className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Analytics"),
    },
    {
      title: "WhatsApp Business",
      description: "Connect with customers through WhatsApp",
      icon: <MessageCircle className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect WhatsApp"),
    },
    {
      title: "Time Clock",
      description: "Employee time tracking and management",
      icon: <Clock className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Time Clock"),
    },
    {
      title: "Vehicle Database",
      description: "Access vehicle specifications and repair information",
      icon: <Database className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Vehicle Database"),
    },
    {
      title: "Online Store",
      description: "Sell parts and services online",
      icon: <ShoppingCart className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Online Store"),
    },
    {
      title: "Maps Integration",
      description: "Route planning and location services",
      icon: <Map className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Maps"),
    },
    {
      title: "Push Notifications",
      description: "Send updates through mobile app notifications",
      icon: <Bell className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Push Notifications"),
    },
    {
      title: "Receipt Printer",
      description: "Connect with receipt and invoice printers",
      icon: <Printer className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Receipt Printer"),
    },
    {
      title: "Photo Documentation",
      description: "Manage and store vehicle repair photos",
      icon: <Camera className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Photo Documentation"),
    },
    {
      title: "Mobile App",
      description: "Connect with your custom mobile application",
      icon: <Smartphone className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Mobile App"),
    },
    {
      title: "Cloud Backup",
      description: "Automatic data backup and recovery",
      icon: <Cloud className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Cloud Backup"),
    },
    {
      title: "Diagnostic Tools",
      description: "Connect with vehicle diagnostic equipment",
      icon: <Wrench className="w-6 h-6" />,
      status: "not_connected" as const,
      onConnect: () => console.log("Connect Diagnostic Tools"),
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