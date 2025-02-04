import { DollarSign, Package } from "lucide-react";

export function SupplierStats() {
  const stats = [
    { 
      label: "Total Spent", 
      value: Math.floor(Math.random() * 100000), 
      icon: <DollarSign className="h-4 w-4 text-primary" />,
      subtitle: "Last 12 months" 
    },
    { 
      label: "Active Products", 
      value: Math.floor(Math.random() * 50), 
      icon: <Package className="h-4 w-4 text-primary" />,
      subtitle: "In inventory" 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
      {stats.map((stat, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {stat.icon}
            {stat.label}
          </div>
          <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}