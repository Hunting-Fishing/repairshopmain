
export const getBadgeVariant = (
  changeType: string
): "default" | "destructive" | "secondary" | "outline" => {
  switch (changeType) {
    case "create":
      return "secondary";
    case "update":
      return "default";
    case "delete":
      return "destructive";
    default:
      return "outline";
  }
};

export const getChangeDescription = (entry: {
  change_type: string;
  quantity_change: number | null;
}) => {
  switch (entry.change_type) {
    case "create":
      return "Item Added";
    case "update":
      if (entry.quantity_change) {
        return entry.quantity_change > 0
          ? `Quantity Increased by ${entry.quantity_change}`
          : `Quantity Decreased by ${Math.abs(entry.quantity_change)}`;
      }
      return "Details Updated";
    case "delete":
      return "Item Removed";
    default:
      return entry.change_type;
  }
};
