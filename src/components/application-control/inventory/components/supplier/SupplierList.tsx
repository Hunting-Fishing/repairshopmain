import { SupplierCard } from "./SupplierCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierList({ suppliers, isLoading }: SupplierListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const groupedSuppliers = useMemo(() => {
    if (!suppliers) return {};

    const filtered = suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, supplier) => {
      const country = supplier.address?.toLowerCase().includes('canada') 
        ? 'Canada' 
        : supplier.address?.toLowerCase().includes('usa') || supplier.address?.toLowerCase().includes('united states')
          ? 'USA' 
          : 'International';

      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(supplier);
      return acc;
    }, {} as Record<string, InventorySupplier[]>);
  }, [suppliers, searchQuery]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading suppliers...</span>
        </CardContent>
      </Card>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No suppliers found. Add your first supplier to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {Object.entries(groupedSuppliers).map(([region, regionSuppliers]) => (
        <div key={region} className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{region}</h3>
            <span className="text-sm text-muted-foreground">
              ({regionSuppliers.length} suppliers)
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {regionSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}