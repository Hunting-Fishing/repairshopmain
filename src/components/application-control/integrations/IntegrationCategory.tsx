import { IntegrationCard } from "./IntegrationCard";
import { LucideIcon } from "lucide-react";

interface IntegrationItem {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "not_connected";
  onConnect: () => void;
}

interface IntegrationCategoryProps {
  title: string;
  items: IntegrationItem[];
}

export const IntegrationCategory = ({ title, items }: IntegrationCategoryProps) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{title}</h2>
    {items.map((integration) => (
      <IntegrationCard key={integration.title} {...integration} />
    ))}
  </div>
);