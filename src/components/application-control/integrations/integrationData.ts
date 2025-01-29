import { 
  Zap, Mail, CreditCard, MessageSquare, Calendar, Phone, 
  BarChart, MessageCircle, Clock, Database, ShoppingCart, 
  Map, Bell, Printer, Camera, Smartphone, Cloud, Wrench, 
  Car, BookOpen, Building2, CircuitBoard, Warehouse, ClipboardList 
} from "lucide-react";

export const integrationCategories = {
  communication: {
    title: "Communication & Notifications",
    items: [
      {
        title: "Twilio",
        description: "Send SMS and voice notifications to customers",
        icon: Phone,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Twilio"),
      },
      {
        title: "Email Service",
        description: "Send automated emails and notifications",
        icon: Mail,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Email Service"),
      },
      {
        title: "WhatsApp Business",
        description: "Connect with customers through WhatsApp",
        icon: MessageCircle,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect WhatsApp"),
      },
      {
        title: "Push Notifications",
        description: "Send updates through mobile app notifications",
        icon: Bell,
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
        icon: Car,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to NHTSA"),
      },
      {
        title: "NEXPART",
        description: "Connect to WorldPac/NEXPART parts catalog",
        icon: Warehouse,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to NEXPART"),
      },
      {
        title: "Mitchell1",
        description: "Access repair information and labor times",
        icon: BookOpen,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Mitchell1"),
      },
      {
        title: "MOTOR",
        description: "Vehicle data and repair procedures",
        icon: Database,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to MOTOR"),
      },
      {
        title: "ALLDATA",
        description: "OEM repair information and diagrams",
        icon: CircuitBoard,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to ALLDATA"),
      },
      {
        title: "CarFax",
        description: "Access vehicle history reports",
        icon: ClipboardList,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to CarFax"),
      },
      {
        title: "Parts Canada",
        description: "Access Canadian auto parts catalog and inventory",
        icon: Warehouse,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Parts Canada"),
      },
      {
        title: "Diagnostic Tools",
        description: "Connect with vehicle diagnostic equipment",
        icon: Wrench,
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
        icon: Zap,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Zapier"),
      },
      {
        title: "Payment Gateway",
        description: "Process payments securely",
        icon: CreditCard,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Payment Gateway"),
      },
      {
        title: "Analytics",
        description: "Track business performance and generate reports",
        icon: BarChart,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Analytics"),
      },
      {
        title: "Time Clock",
        description: "Employee time tracking and management",
        icon: Clock,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Time Clock"),
      },
      {
        title: "Cloud Backup",
        description: "Automatic data backup and recovery",
        icon: Cloud,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Cloud Backup"),
      },
      {
        title: "Mobile App",
        description: "Connect with your custom mobile application",
        icon: Smartphone,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Mobile App"),
      },
    ],
  },
};