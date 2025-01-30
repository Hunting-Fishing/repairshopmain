import { LucideIcon } from "lucide-react";

export interface ApiEndpoint {
  name: string;
  status: "active" | "coming_soon";
  endpoint?: string;
  description: string;
}

export interface IntegrationItem {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "not_connected";
  onConnect: () => void;
  websiteUrl?: string;
  documentationUrl?: string;
  apis?: ApiEndpoint[];
}

export interface IntegrationCategory {
  title: string;
  items: IntegrationItem[];
}