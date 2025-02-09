
import type { InventoryItemStatus } from "../../types";

export const getStatusColor = (status: InventoryItemStatus) => {
  const colors = {
    needs_attention: "bg-orange-500 hover:bg-orange-600",
    active: "bg-blue-500 hover:bg-blue-600",
    inactive: "bg-gray-500 hover:bg-gray-600",
  };
  return colors[status] || "bg-gray-500 hover:bg-gray-600";
};

export const getStatusLabel = (status: InventoryItemStatus) => {
  const labels = {
    needs_attention: "Needs Attention",
    active: "Active",
    inactive: "Inactive",
  };
  return labels[status] || status;
};
