
export function buildAmazonPayload(associateTag: string, asin?: string, keywords?: string) {
  const commonResources = [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "Offers.Listings.Price"
  ];

  if (asin) {
    return {
      "ItemIds": [asin],
      "Resources": commonResources,
      "PartnerTag": associateTag,
      "PartnerType": "Associates",
      "Marketplace": "www.amazon.com",
      "Operation": "GetItems"
    };
  }

  return {
    "Keywords": keywords,
    "SearchIndex": "All",  // Changed to match example
    "Resources": commonResources,
    "PartnerTag": associateTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
    "Operation": "SearchItems",
    "ItemCount": 3  // Added to match example
  };
}
