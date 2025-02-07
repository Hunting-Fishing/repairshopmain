
export function buildAmazonPayload(associateTag: string, asin?: string, keywords?: string) {
  const commonResources = [
    "Images.Primary.Large",
    "Images.Primary.Medium",
    "Images.Variants.Large",
    "ItemInfo.Title",
    "ItemInfo.Features",
    "Offers.Listings.Price",
    "Offers.Listings.DeliveryInfo.IsPrimeEligible",
    "CustomerReviews"
  ];

  if (asin) {
    return {
      "ItemIds": [asin],
      "Resources": [
        ...commonResources,
        "ItemInfo.ProductInfo",
        "ItemInfo.ByLineInfo",
        "ItemInfo.ContentInfo",
        "ItemInfo.ManufactureInfo",
        "ItemInfo.TechnicalInfo",
        "Offers.Listings.Promotions",
        "Offers.Summaries"
      ],
      "PartnerTag": associateTag,
      "PartnerType": "Associates",
      "Marketplace": "www.amazon.com",
      "Operation": "GetItems"
    };
  }

  return {
    "Keywords": keywords,
    "SearchIndex": "Automotive",
    "Resources": commonResources,
    "PartnerTag": associateTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
    "Operation": "SearchItems"
  };
}

