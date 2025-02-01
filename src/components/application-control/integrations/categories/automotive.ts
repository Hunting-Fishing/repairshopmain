import { Car, Database, CircuitBoard, Warehouse, ClipboardList, BookOpen, Wrench } from "lucide-react";
import { IntegrationCategory } from "../types";

export const automotiveIntegrations: IntegrationCategory = {
  title: "Automotive Data & Diagnostics",
  items: [
    {
      title: "NHTSA Database",
      description: "Access vehicle safety data and recalls",
      icon: Car,
      status: "connected",
      onConnect: () => console.log("Connect to NHTSA"),
      websiteUrl: "https://www.nhtsa.gov/data",
      documentationUrl: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
      apis: [
        {
          name: "VIN Decoder API",
          status: "active",
          endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/",
          description: "Currently integrated and active - Decode VINs to get detailed vehicle specifications"
        },
        {
          name: "Make/Model/Year API",
          status: "active",
          endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/",
          description: "Currently integrated - Get all models for a specific make"
        },
        {
          name: "vPIC API",
          status: "active",
          endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/",
          description: "Vehicle Product Information Catalog - Comprehensive vehicle data including makes, models, and specifications"
        },
        {
          name: "Recall Database API",
          status: "coming_soon",
          endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/recalls/",
          description: "Not yet integrated - Access vehicle recall information and safety notices"
        },
        {
          name: "Safety Ratings API",
          status: "coming_soon",
          endpoint: "https://vpic.nhtsa.dot.gov/api/SafetyRatings/",
          description: "Not yet integrated - Get NHTSA crash test ratings and safety evaluations"
        },
        {
          name: "Technical Service Bulletins API",
          status: "coming_soon",
          endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/tsbs/",
          description: "Not yet integrated - Access manufacturer service bulletins and technical notices"
        },
        {
          name: "Complaints API",
          status: "coming_soon",
          endpoint: "https://vpic.nhtsa.dot.gov/api/Complaints/",
          description: "Not yet integrated - Access vehicle complaints database"
        }
      ]
    },
    {
      title: "NEXPART",
      description: "Connect to WorldPac/NEXPART parts catalog",
      icon: Warehouse,
      status: "not_connected",
      onConnect: () => console.log("Connect to NEXPART"),
      websiteUrl: "https://www.nexpart.com",
      documentationUrl: "https://www.nexpart.com/api",
    },
    {
      title: "Mitchell1",
      description: "Access repair information and labor times",
      icon: BookOpen,
      status: "not_connected",
      onConnect: () => console.log("Connect to Mitchell1"),
      websiteUrl: "https://www.mitchell1.com",
      documentationUrl: "https://www.mitchell1.com/api",
    },
    {
      title: "MOTOR",
      description: "Vehicle data and repair procedures",
      icon: Database,
      status: "not_connected",
      onConnect: () => console.log("Connect to MOTOR"),
      websiteUrl: "https://www.motor.com",
      documentationUrl: "https://www.motor.com/api",
    },
    {
      title: "ALLDATA",
      description: "OEM repair information and diagrams",
      icon: CircuitBoard,
      status: "not_connected",
      onConnect: () => console.log("Connect to ALLDATA"),
      websiteUrl: "https://www.alldata.com",
      documentationUrl: "https://www.alldata.com/api",
    },
    {
      title: "CarFax",
      description: "Access vehicle history reports",
      icon: ClipboardList,
      status: "not_connected",
      onConnect: () => console.log("Connect to CarFax"),
      websiteUrl: "https://www.carfax.com",
      documentationUrl: "https://www.carfax.com/api",
    },
    {
      title: "Diagnostic Tools",
      description: "Connect with vehicle diagnostic equipment",
      icon: Wrench,
      status: "not_connected",
      onConnect: () => console.log("Connect Diagnostic Tools"),
      websiteUrl: "https://www.diagnostictools.com",
      documentationUrl: "https://www.diagnostictools.com/api",
    }
  ]
};