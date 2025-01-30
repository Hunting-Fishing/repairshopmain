import { Phone, Mail, MessageCircle, Bell } from "lucide-react";
import { IntegrationCategory } from "../types";

export const communicationIntegrations: IntegrationCategory = {
  title: "Communication & Notifications",
  items: [
    {
      title: "Twilio",
      description: "Send SMS and voice notifications to customers",
      icon: Phone,
      status: "not_connected",
      onConnect: () => console.log("Connect to Twilio"),
      websiteUrl: "https://www.twilio.com",
      documentationUrl: "https://www.twilio.com/docs",
    },
    {
      title: "Email Service",
      description: "Send automated emails and notifications",
      icon: Mail,
      status: "not_connected",
      onConnect: () => console.log("Connect Email Service"),
      websiteUrl: "https://www.emailservice.com",
      documentationUrl: "https://www.emailservice.com/docs",
    },
    {
      title: "WhatsApp Business",
      description: "Connect with customers through WhatsApp",
      icon: MessageCircle,
      status: "not_connected",
      onConnect: () => console.log("Connect WhatsApp"),
      websiteUrl: "https://www.whatsapp.com/business",
      documentationUrl: "https://www.whatsapp.com/business/api",
    },
    {
      title: "Push Notifications",
      description: "Send updates through mobile app notifications",
      icon: Bell,
      status: "not_connected",
      onConnect: () => console.log("Connect Push Notifications"),
      websiteUrl: "https://www.pushnotifications.com",
      documentationUrl: "https://www.pushnotifications.com/docs",
    }
  ]
};