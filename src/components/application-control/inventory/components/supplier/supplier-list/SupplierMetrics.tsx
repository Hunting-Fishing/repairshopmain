interface SupplierMetricsProps {
  activeSuppliers: number;
  totalSpent: number;
  averageScore: number;
}

export function SupplierMetrics({ activeSuppliers, totalSpent, averageScore }: SupplierMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-muted-foreground">Active Suppliers</h3>
        <p className="text-2xl font-bold">{activeSuppliers}</p>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-muted-foreground">Total Spent</h3>
        <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-muted-foreground">Average Score</h3>
        <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
      </div>
    </div>
  );
}