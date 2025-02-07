
import { ProductCategory } from "@/types/shop";

export const productCategories: ProductCategory[] = [
  {
    id: "diagnostics",
    name: "Adjust - Diagnose - Symptoms",
    keywords: ["automotive diagnostic tools", "diagnostic scanner", "code reader"]
  },
  {
    id: "maintenance",
    name: "Basic Maintenance",
    keywords: ["basic car maintenance tools", "oil change tools", "filter tools"]
  },
  {
    id: "brakes",
    name: "Brakes & Wheels",
    keywords: ["brake tools", "wheel tools", "brake service kit"]
  },
  {
    id: "cooling",
    name: "Cooling System & Belts",
    keywords: ["cooling system tools", "belt tools", "radiator service tools"]
  },
  {
    id: "computers",
    name: "Computers & Electronics",
    keywords: ["automotive computer tools", "electronic diagnostic tools"]
  },
  {
    id: "drivetrain",
    name: "Drive Train, Axles & Rear End",
    keywords: ["drivetrain tools", "axle tools", "differential tools"]
  },
  {
    id: "electrical",
    name: "Electrical & Lights",
    keywords: ["automotive electrical tools", "circuit tester", "electrical repair kit"]
  },
  {
    id: "engine",
    name: "Engine & Valve Train",
    keywords: ["engine tools", "valve train tools", "timing tools"]
  },
  {
    id: "exhaust",
    name: "Exhaust & Emissions",
    keywords: ["exhaust tools", "emissions tools", "exhaust repair kit"]
  },
  {
    id: "suspension",
    name: "Front End & Suspension",
    keywords: ["suspension tools", "front end tools", "strut tools"]
  },
  {
    id: "fuel",
    name: "Fuel System & Tune-Up",
    keywords: ["fuel system tools", "tune up tools", "fuel line tools"]
  },
  {
    id: "gaskets",
    name: "Gaskets & Seals",
    keywords: ["gasket tools", "seal tools", "gasket maker tools"]
  },
  {
    id: "hvac",
    name: "Heating & Air Conditioning",
    keywords: ["ac tools", "hvac tools", "ac service kit"]
  },
  {
    id: "misc",
    name: "Miscellaneous & Accessories",
    keywords: ["automotive accessories", "misc automotive tools"],
    directLinks: [
      {
        url: "https://amzn.to/40INV6K",
        asin: "B07BD2LXTF",  // Updated ASIN for a specific featured product
        title: "Featured Automotive Accessories",
        description: "High-quality automotive accessories and tools"
      }
    ]
  },
  {
    id: "steering",
    name: "Steering Column & Gauges",
    keywords: ["steering tools", "gauge tools", "steering service tools"]
  },
  {
    id: "transmission",
    name: "Transmission & Trans-Axle",
    keywords: ["transmission tools", "trans-axle tools", "transmission service kit"]
  }
];
