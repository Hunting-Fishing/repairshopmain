
import { Zap, CreditCard, BarChart, Clock, Cloud, Smartphone, ShoppingBag } from "lucide-react";
import { IntegrationCategory } from "../types";

export const businessIntegrations: IntegrationCategory = {
  title: "Business Operations",
  items: [
    {
      title: "Amazon Associates",
      description: "Track and manage affiliate sales through Amazon's Associates program",
      icon: ShoppingBag,
      status: "not_connected",
      onConnect: () => console.log("Connect to Amazon Associates"),
      websiteUrl: "https://affiliate-program.amazon.com/",
      documentationUrl: "https://affiliate-program.amazon.com/help/node/topic/GP38PJ6EUR6PFBEC",
    },
    {
      title: "Zapier",
      description: "Automate workflows by connecting with thousands of apps",
      icon: Zap,
      status: "not_connected",
      onConnect: () => console.log("Connect to Zapier"),
      websiteUrl: "https://zapier.com",
      documentationUrl: "https://zapier.com/developer/documentation",
    },
    {
      title: "Payment Gateway",
      description: "Process payments securely",
      icon: CreditCard,
      status: "not_connected",
      onConnect: () => console.log("Connect Payment Gateway"),
      websiteUrl: "https://www.paymentgateway.com",
      documentationUrl: "https://www.paymentgateway.com/docs",
    },
    {
      title: "Analytics",
      description: "Track business performance and generate reports",
      icon: BarChart,
      status: "not_connected",
      onConnect: () => console.log("Connect Analytics"),
      websiteUrl: "https://www.analytics.com",
      documentationUrl: "https://www.analytics.com/docs",
    },
    {
      title: "Time Clock",
      description: "Employee time tracking and management",
      icon: Clock,
      status: "not_connected",
      onConnect: () => console.log("Connect Time Clock"),
      websiteUrl: "https://www.timeclock.com",
      documentationUrl: "https://www.timeclock.com/docs",
    },
    {
      title: "Cloud Backup",
      description: "Automatic data backup and recovery",
      icon: Cloud,
      status: "not_connected",
      onConnect: () => console.log("Connect Cloud Backup"),
      websiteUrl: "https://www.cloudbackup.com",
      documentationUrl: "https://www.cloudbackup.com/docs",
    },
    {
      title: "Mobile App",
      description: "Connect with your custom mobile application",
      icon: Smartphone,
      status: "not_connected",
      onConnect: () => console.log("Connect Mobile App"),
      websiteUrl: "https://www.mobileapp.com",
      documentationUrl: "https://www.mobileapp.com/docs",
    }
  ]
};
