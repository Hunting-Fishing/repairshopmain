import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCertifications } from "./hooks/useCertifications";
import { CertificationDialog } from "./CertificationDialog";
import { CertificationFilters } from "./components/CertificationFilters";
import { CertificationTable } from "./components/CertificationTable";
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

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilter(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const filteredCertifications = certifications?.filter((cert) => {
    const matchesSearch = 
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = !cert.expiry_date ? "No Expiry" :
      new Date(cert.expiry_date) < new Date() ? "Expired" :
      new Date(cert.expiry_date) <= new Date(new Date().setMonth(new Date().getMonth() + 1)) ? "Expiring Soon" :
      "Valid";
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(status);
    
    if (status === "Expiring Soon") {
      toast.warning(`Certification "${cert.name}" is expiring soon!`, {
        description: "Please renew before expiration.",
      });
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certifications</h3>
        <Button onClick={() => setIsDialogOpen(true)}>Add Certification</Button>
      </div>

      <CertificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <CertificationTable certifications={filteredCertifications || []} />

      <CertificationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        profileId={profileId}
      />
    </div>
  );
}