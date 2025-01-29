import { IntegrationCard } from "./IntegrationCard";
import { LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value={title}>
      <AccordionTrigger className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 rounded-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {items.map((integration) => (
          <IntegrationCard key={integration.title} {...integration} />
        ))}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);