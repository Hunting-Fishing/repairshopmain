import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SupplierLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Suppliers</h1>
          <p className="text-muted-foreground">Loading supplier data...</p>
        </div>
      </div>
      <LoadingSpinner />
    </div>
  );
}