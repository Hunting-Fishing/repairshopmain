import { cn } from "@/lib/utils";

interface IntegrationStatusProps {
  status: "connected" | "not_connected";
}

export const IntegrationStatus = ({ status }: IntegrationStatusProps) => (
  <span 
    className={cn(
      "text-sm px-2 py-1 rounded-full",
      status === 'connected' 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    )}
  >
    {status === 'connected' ? 'Connected' : 'Not Connected'}
  </span>
);