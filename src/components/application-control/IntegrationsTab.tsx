import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, Mail, CreditCard, MessageSquare, Calendar, Phone, 
  BarChart, MessageCircle, Clock, Database, ShoppingCart, 
  Map, Bell, Printer, Camera, Smartphone, Cloud, Wrench, 
  Car, BookOpen, Building2, CircuitBoard, Warehouse, ClipboardList 
} from "lucide-react";

const integrationCategories = {
  communication: {
    title: "Communication & Notifications",
    items: [
      {
        title: "Twilio",
        description: "Send SMS and voice notifications to customers",
        icon: <Phone className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Twilio"),
      },
      {
        title: "Email Service",
        description: "Send automated emails and notifications",
        icon: <Mail className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Email Service"),
      },
      {
        title: "WhatsApp Business",
        description: "Connect with customers through WhatsApp",
        icon: <MessageCircle className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect WhatsApp"),
      },
      {
        title: "Push Notifications",
        description: "Send updates through mobile app notifications",
        icon: <Bell className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Push Notifications"),
      },
    ],
  },
  automotive: {
    title: "Automotive Data & Diagnostics",
    items: [
      {
        title: "NHTSA Database",
        description: "Access vehicle safety data and recalls",
        icon: <Car className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to NHTSA"),
      },
      {
        title: "NEXPART",
        description: "Connect to WorldPac/NEXPART parts catalog",
        icon: <Warehouse className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to NEXPART"),
      },
      {
        title: "Mitchell1",
        description: "Access repair information and labor times",
        icon: <BookOpen className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Mitchell1"),
      },
      {
        title: "MOTOR",
        description: "Vehicle data and repair procedures",
        icon: <Database className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to MOTOR"),
      },
      {
        title: "ALLDATA",
        description: "OEM repair information and diagrams",
        icon: <CircuitBoard className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to ALLDATA"),
      },
      {
        title: "CarFax",
        description: "Access vehicle history reports",
        icon: <ClipboardList className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to CarFax"),
      },
      {
        title: "Diagnostic Tools",
        description: "Connect with vehicle diagnostic equipment",
        icon: <Wrench className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Diagnostic Tools"),
      },
    ],
  },
  business: {
    title: "Business Operations",
    items: [
      {
        title: "Zapier",
        description: "Automate workflows by connecting with thousands of apps",
        icon: <Zap className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Zapier"),
      },
      {
        title: "Payment Gateway",
        description: "Process payments securely",
        icon: <CreditCard className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Payment Gateway"),
      },
      {
        title: "Analytics",
        description: "Track business performance and generate reports",
        icon: <BarChart className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Analytics"),
      },
      {
        title: "Time Clock",
        description: "Employee time tracking and management",
        icon: <Clock className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Time Clock"),
      },
      {
        title: "Cloud Backup",
        description: "Automatic data backup and recovery",
        icon: <Cloud className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Cloud Backup"),
      },
      {
        title: "Mobile App",
        description: "Connect with your custom mobile application",
        icon: <Smartphone className="w-6 h-6" />,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Mobile App"),
      },
    ],
  },
};

const IntegrationCard = ({ title, description, icon, status, onConnect }) => (
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

const IntegrationCategory = ({ title, items }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{title}</h2>
    {items.map((integration) => (
      <IntegrationCard key={integration.title} {...integration} />
    ))}
  </div>
);

export function IntegrationsTab() {
  return (
    <div className="space-y-8">
      {Object.values(integrationCategories).map((category) => (
        <IntegrationCategory 
          key={category.title} 
          title={category.title} 
          items={category.items} 
        />
      ))}
    </div>
  );
}