import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type RequestType = 'decode' | 'recalls' | 'vin_recalls' | 'safety' | 'complaints';

interface VehicleRequest {
  type: RequestType;
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
}

// IMPORTANT: DO NOT MODIFY THESE URLs WITHOUT THOROUGH TESTING
const API_ENDPOINTS = {
  VIN_DECODE: 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/',
  RECALLS: 'https://api.nhtsa.gov/recalls/recallsByVehicle',
  VIN_RECALLS: 'https://api.nhtsa.gov/recalls/recallsByVIN/',
  SAFETY: 'https://api.nhtsa.gov/SafetyRatings/vehicle/',
  COMPLAINTS: 'https://api.nhtsa.gov/complaints/complaintsByVehicle',
} as const;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: VehicleRequest = await req.json();
    console.log('Request data:', requestData);

    let url: string;
    const { type, vin, make, model, year } = requestData;

    switch (type) {
      case 'decode':
        if (!vin) {
          throw new Error('VIN is required for decoding');
        }
        url = `${API_ENDPOINTS.VIN_DECODE}${encodeURIComponent(vin)}?format=json`;
        break;

      case 'vin_recalls':
        if (!vin) {
          throw new Error('VIN is required for VIN-based recall lookup');
        }
        url = `${API_ENDPOINTS.VIN_RECALLS}${encodeURIComponent(vin)}`;
        break;

      case 'recalls':
        if (!make || !model || !year) {
          throw new Error('Make, model, and year are required for recalls');
        }
        url = `${API_ENDPOINTS.RECALLS}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        break;

      case 'safety':
        if (!make || !model || !year) {
          throw new Error('Make, model, and year are required for safety ratings');
        }
        url = `${API_ENDPOINTS.SAFETY}${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`;
        break;

      case 'complaints':
        if (!make || !model || !year) {
          throw new Error('Make, model, and year are required for complaints');
        }
        url = `${API_ENDPOINTS.COMPLAINTS}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        break;

      default:
        throw new Error(`Invalid request type: ${type}`);
    }

    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('API Response:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch vehicle information',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});