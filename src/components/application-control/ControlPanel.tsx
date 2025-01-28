import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
}

export function ControlPanel({ title, description, icon: Icon, action }: ControlPanelProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={action}
        >
          Manage
        </Button>
      </CardContent>
    </Card>
  );
}