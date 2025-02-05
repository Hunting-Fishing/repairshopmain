import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CertificationStatus } from "./CertificationStatus";
import type { Certification } from "../hooks/useCertifications";

interface CertificationTableProps {
  certifications: Certification[];
}

export function CertificationTable({ certifications }: CertificationTableProps) {
  return (
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
              <CertificationStatus expiryDate={cert.expiry_date} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}