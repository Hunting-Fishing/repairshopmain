import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserSquare2 } from "lucide-react";

export function CustomerControl() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <UserSquare2 className="h-8 w-8 text-muted-foreground" />
          <div>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>Configure customer settings and view analytics</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/customers")}
        >
          Manage Customers
        </Button>
      </CardContent>
    </Card>
  );
}