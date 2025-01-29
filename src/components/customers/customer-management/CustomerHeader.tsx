import { UserSquare2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  onNavigateToControl: () => void;
}

export function CustomerHeader({ onNavigateToControl }: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <UserSquare2 className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Configure customer-related settings and view analytics
          </p>
        </div>
      </div>
      <Button onClick={onNavigateToControl} variant="outline">
        <Settings2 className="h-4 w-4 mr-2" />
        Control Settings
      </Button>
    </div>
  );
}