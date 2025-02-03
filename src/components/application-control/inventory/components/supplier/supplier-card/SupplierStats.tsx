export function SupplierStats() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
      <div>
        <div className="text-sm font-medium">Products</div>
        <div className="mt-1 text-2xl font-bold">
          {Math.floor(Math.random() * 100000)}
        </div>
        <div className="text-xs text-muted-foreground">Total Products</div>
      </div>
      <div>
        <div className="text-sm font-medium">With UPC</div>
        <div className="mt-1 text-2xl font-bold">
          {Math.floor(Math.random() * 50000)}
        </div>
        <div className="text-xs text-muted-foreground">Products w/ UPC</div>
      </div>
    </div>
  );
}