
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInformation } from "./sections/ContactInformation";
import { BusinessDetails } from "./sections/BusinessDetails";
import { FinancialInformation } from "./sections/FinancialInformation";
import { AdditionalInformation } from "./sections/AdditionalInformation";
import { SupplierReports } from "./SupplierReports";
import { SupplierFinancials } from "./SupplierFinancials";
import { SupplierTransactions } from "./SupplierTransactions";
import { SupplierCommunications } from "./SupplierCommunications";
import type { InventorySupplier } from "../../../types";

interface SupplierDetailsViewProps {
  supplier: InventorySupplier;
  onClose: () => void;
}

export function SupplierDetailsView({ supplier, onClose }: SupplierDetailsViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{supplier.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ContactInformation supplier={supplier} isEditing={false} onInputChange={() => {}} />
          <BusinessDetails supplier={supplier} isEditing={false} onInputChange={() => {}} />
          <FinancialInformation supplier={supplier} isEditing={false} onInputChange={() => {}} />
          <AdditionalInformation supplier={supplier} isEditing={false} onInputChange={() => {}} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierReports supplier={supplier} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierFinancials supplier={supplier} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierTransactions supplier={supplier} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierCommunications supplier={supplier} />
        </CardContent>
      </Card>
    </div>
  );
}
