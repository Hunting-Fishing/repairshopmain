
import { Card, CardContent } from "@/components/ui/card";
import { AddPartDialog } from "./AddPartDialog";
import { PartsList } from "./PartsList";
import { usePartsQuery } from "./hooks/usePartsQuery";

interface PartsTabProps {
  repairJobId: string;
}

export function PartsTab({ repairJobId }: PartsTabProps) {
  const { data: parts, isLoading } = usePartsQuery(repairJobId);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Parts Used</h3>
          <AddPartDialog repairJobId={repairJobId} />
        </div>
        <PartsList parts={parts ?? []} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
