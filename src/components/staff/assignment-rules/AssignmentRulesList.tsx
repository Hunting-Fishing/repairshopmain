import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentRule {
  id: string;
  name: string;
  priority: number;
  is_active: boolean;
  criteria: Record<string, any>;
}

interface AssignmentRulesListProps {
  rules: AssignmentRule[];
  isLoading: boolean;
}

export function AssignmentRulesList({ rules, isLoading }: AssignmentRulesListProps) {
  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rule Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                <Badge variant={rule.is_active ? "default" : "secondary"}>
                  {rule.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch checked={rule.is_active} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}