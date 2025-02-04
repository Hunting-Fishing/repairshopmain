import { useState, useMemo } from "react";
import type { InventorySupplier, SupplierAnalyticsData } from "../../../types";

export function useSupplierFilters(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof InventorySupplier>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof InventorySupplier) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => {
        const matchesSearch = 
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filterStatus && supplier.status !== filterStatus) {
          return false;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const direction = sortDirection === "asc" ? 1 : -1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction * aValue.localeCompare(bValue);
        }
        return 0;
      });
  }, [suppliers, searchQuery, filterStatus, sortField, sortDirection]);

  // Calculate analytics data
  const analytics: SupplierAnalyticsData = useMemo(() => {
    if (!suppliers.length) return {
      total_spend: 0,
      orders_count: 0,
      on_time_delivery_rate: 0,
      quality_rating: 0,
      orders_fulfilled: 0,
      average_delivery_time: 0,
      payment_timeliness_score: 0,
      inventory_value: 0,
      return_rate: 0,
      average_lead_time: 0
    };

    return {
      total_spend: suppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0),
      orders_count: suppliers.length,
      on_time_delivery_rate: suppliers.reduce((sum, s) => sum + (s.fulfillment_rate || 0), 0) / suppliers.length,
      quality_rating: suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length,
      orders_fulfilled: suppliers.reduce((sum, s) => sum + (s.fulfillment_rate ? 1 : 0), 0),
      average_delivery_time: 0,
      payment_timeliness_score: 0,
      inventory_value: 0,
      return_rate: 0,
      average_lead_time: 0
    };
  }, [suppliers]);

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortField,
    sortDirection,
    handleSort,
    filteredSuppliers,
    analytics
  };
}