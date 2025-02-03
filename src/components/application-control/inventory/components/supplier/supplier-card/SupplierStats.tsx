export function SupplierStats() {
  const stats = [
    { label: "Products", value: Math.floor(Math.random() * 100000), subtitle: "Total Products" },
    { label: "With UPC", value: Math.floor(Math.random() * 50000), subtitle: "Products w/ UPC" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="text-sm font-medium">{stat.label}</div>
          <div className="mt-1 text-2xl font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}