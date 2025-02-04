import { format } from "date-fns";
import { CalendarIcon, AlertTriangle, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCertifications } from "./hooks/useCertifications";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CertificationDialog } from "./CertificationDialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CertificationListProps {
  profileId?: string;
}

export function CertificationList({ profileId }: CertificationListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const { data: certifications, isLoading } = useCertifications(profileId);

  if (isLoading) {
    return <div>Loading certifications...</div>;
  }

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date);
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
    return expiryDate <= monthFromNow;
  };

  const isExpired = (date: string) => {
    const expiryDate = new Date(date);
    return expiryDate < new Date();
  };

  const getStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "No Expiry";
    if (isExpired(expiryDate)) return "Expired";
    if (isExpiringSoon(expiryDate)) return "Expiring Soon";
    return "Valid";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Expired":
        return "destructive";
      case "Expiring Soon":
        return "warning";
      case "Valid":
        return "success";
      default:
        return "secondary";
    }
  };

  const filteredCertifications = certifications?.filter((cert) => {
    const matchesSearch = 
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = getStatus(cert.expiry_date);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(status);
    
    return matchesSearch && matchesStatus;
  });

  const handleExpiryNotification = (certName: string) => {
    toast.warning(`Certification "${certName}" is expiring soon!`, {
      description: "Please renew before expiration.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certifications</h3>
        <Button onClick={() => setIsDialogOpen(true)}>Add Certification</Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["Valid", "Expiring Soon", "Expired", "No Expiry"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={(checked) => {
                  setStatusFilter(
                    checked
                      ? [...statusFilter, status]
                      : statusFilter.filter((s) => s !== status)
                  );
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCertifications?.map((cert) => {
            const status = getStatus(cert.expiry_date);
            if (status === "Expiring Soon") {
              handleExpiryNotification(cert.name);
            }
            return (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.name}</TableCell>
                <TableCell>{cert.issuer}</TableCell>
                <TableCell>
                  {cert.issue_date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(cert.issue_date), "PP")}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {cert.expiry_date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(cert.expiry_date), "PP")}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(status)}
                    className="flex items-center gap-1"
                  >
                    {status === "Expiring Soon" && <AlertTriangle className="h-4 w-4" />}
                    {status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <CertificationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        profileId={profileId}
      />
    </div>
  );
}