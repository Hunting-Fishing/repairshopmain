
export const getPostalCodePattern = (countryCode: string) => {
  const patterns: { [key: string]: string } = {
    'US': '^\\d{5}(-\\d{4})?$', // USA: 12345 or 12345-6789
    'CA': '^[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d$', // Canada: A1A 1A1
    'GB': '^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$', // UK: AA9A 9AA
    // Add more country patterns as needed
  };
  return patterns[countryCode] || '^.+$'; // Default to any non-empty string
};
