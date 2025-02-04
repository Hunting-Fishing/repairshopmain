import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TrainingRecord } from "../hooks/useTrainingRecords";

interface TrainingTableProps {
  trainings: TrainingRecord[];
}

export function TrainingTable({ trainings }: TrainingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Training Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Completion Date</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainings?.map((training) => (
          <TableRow key={training.id}>
            <TableCell className="font-medium">{training.training_name}</TableCell>
            <TableCell>{training.description}</TableCell>
            <TableCell>
              {training.completion_date && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(training.completion_date), "PP")}
                </div>
              )}
            </TableCell>
            <TableCell>
              {training.expiry_date && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(training.expiry_date), "PP")}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={training.status === "completed" ? "default" : "secondary"}>
                {training.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}