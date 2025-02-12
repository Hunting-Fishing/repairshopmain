
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Search } from "lucide-react";

interface Variable {
  name: string;
  description: string;
  example: string;
  category: string;
}

const SAMPLE_VARIABLES: Variable[] = [
  {
    name: "customer.firstName",
    description: "Customer's first name",
    example: "John",
    category: "Customer"
  },
  {
    name: "customer.lastName",
    description: "Customer's last name",
    example: "Doe",
    category: "Customer"
  },
  {
    name: "appointment.date",
    description: "Appointment date",
    example: "2024-03-15",
    category: "Appointment"
  },
  {
    name: "appointment.time",
    description: "Appointment time",
    example: "14:30",
    category: "Appointment"
  },
  // Add more variables as needed
];

interface VariableManagerProps {
  onInsert: (variable: string) => void;
}

export function VariableManager({ onInsert }: VariableManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVariables = SAMPLE_VARIABLES.filter(
    (variable) =>
      variable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variable.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(
    new Set(SAMPLE_VARIABLES.map((variable) => variable.category))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search variables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category}
              </h4>
              <div className="grid gap-2">
                {filteredVariables
                  .filter((v) => v.category === category)
                  .map((variable) => (
                    <Button
                      key={variable.name}
                      variant="outline"
                      className="justify-start font-normal"
                      onClick={() => onInsert(`{{${variable.name}}}`)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{variable.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {variable.description}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
