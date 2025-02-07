
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
      "Marketplace": "www.amazon.ca",  // Changed to Canadian marketplace
      "Operation": "GetItems"
    };
  }

  return {
    "Keywords": keywords,
    "SearchIndex": "All",
    "Resources": commonResources,
    "PartnerTag": associateTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.ca",  // Changed to Canadian marketplace
    "Operation": "SearchItems",
    "ItemCount": 3
  };
}

