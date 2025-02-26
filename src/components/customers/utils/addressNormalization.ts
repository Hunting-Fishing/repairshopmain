
export interface NormalizedAddress {
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export function normalizeAddress(address: Partial<NormalizedAddress>): NormalizedAddress {
  return {
    street_address: normalizeStreetAddress(address.street_address),
    city: normalizeCity(address.city),
    state_province: normalizeStateProvince(address.state_province),
    postal_code: normalizePostalCode(address.postal_code),
    country: normalizeCountry(address.country),
  };
}

function normalizeStreetAddress(street?: string): string {
  if (!street) return '';
  
  // Remove multiple spaces and special characters
  return street
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s#,-./]/gi, '')
    .replace(/(?<=\d)(st|nd|rd|th)\b/gi, (m) => m.toLowerCase());
}

function normalizeCity(city?: string): string {
  if (!city) return '';
  
  // Capitalize first letter of each word, remove special characters
  return city
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeStateProvince(state?: string): string {
  if (!state) return '';
  
  // Convert to uppercase, remove special characters
  return state
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function normalizePostalCode(postalCode?: string): string {
  if (!postalCode) return '';
  
  // Remove all spaces and special characters except hyphen
  return postalCode
    .trim()
    .replace(/[^\w-]/gi, '')
    .toUpperCase();
}

function normalizeCountry(country?: string): string {
  if (!country) return '';
  
  // Convert to uppercase, remove special characters
  return country
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

export function isAddressComplete(address: Partial<NormalizedAddress>): boolean {
  return Boolean(
    address.street_address &&
    address.city &&
    address.state_province &&
    address.postal_code &&
    address.country
  );
}
