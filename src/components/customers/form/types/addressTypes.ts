
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

export interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const ADDRESS_TYPES = [
  { id: 'residential', label: 'Residential' },
  { id: 'business', label: 'Business' },
  { id: 'po_box', label: 'PO Box' },
  { id: 'other', label: 'Other' }
] as const;

export interface NominatimResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
}
