
import { ReactNode } from "react";
import { CustomerFormFields } from "../form/CustomerFormFields";
import { VehicleList } from "../vehicles/VehicleList";
import { CustomerDocuments } from "../documents/CustomerDocuments";
import { CustomerHistoryList } from "../history/CustomerHistoryList";
import { CustomerCommunications } from "../communications/CustomerCommunications";
import { CustomerAnalyticsDashboard } from "../analytics/CustomerAnalyticsDashboard";
import { CustomerRelationships } from "../relationships/CustomerRelationships";
import { LoyaltyTab } from "../loyalty/LoyaltyTab";
import { CustomerFeedback } from "../feedback/CustomerFeedback";

export interface CustomerTabDefinition {
  id: string;
  label: string;
  component: (props: { customerId: string; form?: any }) => ReactNode;
  requiresForm?: boolean;
}

export const CUSTOMER_TABS: CustomerTabDefinition[] = [
  {
    id: "details",
    label: "Details",
    component: ({ customerId, form }) => (
      <CustomerFormFields form={form} customerId={customerId} />
    ),
    requiresForm: true
  },
  {
    id: "vehicles",
    label: "Vehicles",
    component: ({ customerId }) => <VehicleList customerId={customerId} />
  },
  {
    id: "documents",
    label: "Documents",
    component: ({ customerId }) => <CustomerDocuments customerId={customerId} />
  },
  {
    id: "history",
    label: "History",
    component: ({ customerId }) => <CustomerHistoryList customerId={customerId} />
  },
  {
    id: "communications",
    label: "Communications",
    component: ({ customerId }) => <CustomerCommunications customerId={customerId} />
  },
  {
    id: "analytics",
    label: "Analytics",
    component: ({ customerId }) => <CustomerAnalyticsDashboard customerId={customerId} />
  },
  {
    id: "relationships",
    label: "Relationships",
    component: ({ customerId }) => <CustomerRelationships customerId={customerId} />
  },
  {
    id: "loyalty",
    label: "Loyalty",
    component: () => <LoyaltyTab />
  },
  {
    id: "feedback",
    label: "Feedback",
    component: ({ customerId }) => <CustomerFeedback customerId={customerId} />
  }
];
