
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, Calendar, CreditCard, Building2, User2 } from "lucide-react";
import { formatDate } from "date-fns";

interface Order {
  id: number;
  date: string;
  total: number;
}

interface CustomerDetailsProps {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  orders: Order[];
}

export function CustomerDetailsPage({ customer, orders }: CustomerDetailsProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Customer Info Card with Type */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
              
              {/* Customer Type Section */}
              <div className="py-3 border-y">
                <p className="text-sm font-medium text-muted-foreground mb-2">Customer Type</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Business</span>
                </div>
              </div>
              
              {/* Business/Fleet Details Section */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-muted-foreground">Business Details</p>
                <div className="space-y-2">
                  <p className="text-sm">Tax Number: ABC123456</p>
                  <p className="text-sm">Classification: Enterprise</p>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${customer.email}`} className="hover:text-primary text-sm">
                      {customer.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${customer.phone}`} className="hover:text-primary text-sm">
                      {customer.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History Card */}
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(order.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Payment Methods Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg border border-dashed border-gray-200 text-center">
              <p className="text-sm text-muted-foreground">
                No payment methods added
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
