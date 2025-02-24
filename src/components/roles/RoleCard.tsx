
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleProps {
  role: {
    id: string;
    name: string;
    description: string;
  };
}

export function RoleCard({ role }: RoleProps) {
  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{role.name}</span>
          <Button 
            variant="outline"
            className="hover:bg-primary/10"
          >
            Edit Role
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{role.description}</p>
      </CardContent>
    </Card>
  );
}
