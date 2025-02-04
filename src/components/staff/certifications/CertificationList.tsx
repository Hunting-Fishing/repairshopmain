import { format } from "date-fns";
import { CalendarIcon, AlertTriangle } from "lucide-react";
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

interface CertificationListProps {
  profileId?: string;
}

export function CertificationList({ profileId }: CertificationListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certifications</h3>
        <Button onClick={() => setIsDialogOpen(true)}>Add Certification</Button>
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
          {certifications?.map((cert) => (
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
                {cert.expiry_date && (
                  <Badge 
                    variant={isExpiringSoon(cert.expiry_date) ? "destructive" : "default"}
                    className="flex items-center gap-1"
                  >
                    {isExpiringSoon(cert.expiry_date) && <AlertTriangle className="h-4 w-4" />}
                    {isExpiringSoon(cert.expiry_date) ? "Expiring Soon" : "Valid"}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
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