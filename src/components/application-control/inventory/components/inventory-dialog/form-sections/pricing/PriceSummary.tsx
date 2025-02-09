
interface PriceSummaryProps {
  unitCost: number;
  markupPercentage: number;
}

export function PriceSummary({ unitCost, markupPercentage }: PriceSummaryProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-background/50">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Calculated Price:</span>
        <span className="font-medium">${((unitCost * (1 + markupPercentage / 100))).toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Markup Amount:</span>
        <span className="font-medium">${((unitCost * markupPercentage / 100)).toFixed(2)}</span>
      </div>
    </div>
  );
}
