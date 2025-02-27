
import { Building2, Users2, Store } from "lucide-react";

export interface CustomerTypeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const defaultOptions: CustomerTypeOption[] = [
  {
    value: "Personal",
    label: "Personal Account",
    icon: Users2,
    description: "For individual customers"
  },
  {
    value: "Business",
    label: "Business Account",
    icon: Building2,
    description: "For business customers"
  },
  {
    value: "Fleet",
    label: "Fleet Account",
    icon: Store,
    description: "For fleet management customers"
  }
];
