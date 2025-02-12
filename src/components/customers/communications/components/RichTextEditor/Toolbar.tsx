
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn("flex items-center border-b p-2 gap-1", className)}>
      {children}
    </div>
  );
}
