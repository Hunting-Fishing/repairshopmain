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
        websiteUrl: "https://www.twilio.com",
        documentationUrl: "https://www.twilio.com/docs",
      },
      {
        title: "Email Service",
        description: "Send automated emails and notifications",
        icon: Mail,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Email Service"),
        websiteUrl: "https://www.emailservice.com",
        documentationUrl: "https://www.emailservice.com/docs",
      },
      {
        title: "WhatsApp Business",
        description: "Connect with customers through WhatsApp",
        icon: MessageCircle,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect WhatsApp"),
        websiteUrl: "https://www.whatsapp.com/business",
        documentationUrl: "https://www.whatsapp.com/business/api",
      },
      {
        title: "Push Notifications",
        description: "Send updates through mobile app notifications",
        icon: Bell,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Push Notifications"),
        websiteUrl: "https://www.pushnotifications.com",
        documentationUrl: "https://www.pushnotifications.com/docs",
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
        websiteUrl: "https://www.nhtsa.gov/data",
        documentationUrl: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
        apis: [
          {
            name: "VIN Decoder API",
            status: "active" as const,
            endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/",
            description: "Decode VINs to get detailed vehicle specifications"
          },
          {
            name: "Recall Database API",
            status: "coming_soon" as const,
            endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/recalls/",
            description: "Access vehicle recall information and safety notices"
          },
          {
            name: "Safety Ratings API",
            status: "coming_soon" as const,
            endpoint: "https://vpic.nhtsa.dot.gov/api/SafetyRatings/",
            description: "Get NHTSA crash test ratings and safety evaluations"
          },
          {
            name: "Technical Service Bulletins API",
            status: "coming_soon" as const,
            endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/tsbs/",
            description: "Access manufacturer service bulletins and technical notices"
          }
        ]
      },
      {
        title: "NEXPART",
        description: "Connect to WorldPac/NEXPART parts catalog",
        icon: Warehouse,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to NEXPART"),
        websiteUrl: "https://www.nexpart.com",
        documentationUrl: "https://www.nexpart.com/api",
      },
      {
        title: "Mitchell1",
        description: "Access repair information and labor times",
        icon: BookOpen,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Mitchell1"),
        websiteUrl: "https://www.mitchell1.com",
        documentationUrl: "https://www.mitchell1.com/api",
      },
      {
        title: "MOTOR",
        description: "Vehicle data and repair procedures",
        icon: Database,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to MOTOR"),
        websiteUrl: "https://www.motor.com",
        documentationUrl: "https://www.motor.com/api",
      },
      {
        title: "ALLDATA",
        description: "OEM repair information and diagrams",
        icon: CircuitBoard,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to ALLDATA"),
        websiteUrl: "https://www.alldata.com",
        documentationUrl: "https://www.alldata.com/api",
      },
      {
        title: "CarFax",
        description: "Access vehicle history reports",
        icon: ClipboardList,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to CarFax"),
        websiteUrl: "https://www.carfax.com",
        documentationUrl: "https://www.carfax.com/api",
      },
      {
        title: "Parts Canada",
        description: "Access Canadian auto parts catalog and inventory",
        icon: Warehouse,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect to Parts Canada"),
        websiteUrl: "https://www.partscanada.ca",
        documentationUrl: "https://www.partscanada.ca/api-documentation",
      },
      {
        title: "Diagnostic Tools",
        description: "Connect with vehicle diagnostic equipment",
        icon: Wrench,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Diagnostic Tools"),
        websiteUrl: "https://www.diagnostictools.com",
        documentationUrl: "https://www.diagnostictools.com/api",
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
        websiteUrl: "https://zapier.com",
        documentationUrl: "https://zapier.com/developer/documentation",
        apis: []
      },
      {
        title: "Payment Gateway",
        description: "Process payments securely",
        icon: CreditCard,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Payment Gateway"),
        websiteUrl: "https://www.paymentgateway.com",
        documentationUrl: "https://www.paymentgateway.com/docs",
        apis: []
      },
      {
        title: "Analytics",
        description: "Track business performance and generate reports",
        icon: BarChart,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Analytics"),
        websiteUrl: "https://www.analytics.com",
        documentationUrl: "https://www.analytics.com/docs",
        apis: []
      },
      {
        title: "Time Clock",
        description: "Employee time tracking and management",
        icon: Clock,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Time Clock"),
        websiteUrl: "https://www.timeclock.com",
        documentationUrl: "https://www.timeclock.com/docs",
        apis: []
      },
      {
        title: "Cloud Backup",
        description: "Automatic data backup and recovery",
        icon: Cloud,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Cloud Backup"),
        websiteUrl: "https://www.cloudbackup.com",
        documentationUrl: "https://www.cloudbackup.com/docs",
        apis: []
      },
      {
        title: "Mobile App",
        description: "Connect with your custom mobile application",
        icon: Smartphone,
        status: "not_connected" as const,
        onConnect: () => console.log("Connect Mobile App"),
        websiteUrl: "https://www.mobileapp.com",
        documentationUrl: "https://www.mobileapp.com/docs",
        apis: []
      },
    ],
  },
};
