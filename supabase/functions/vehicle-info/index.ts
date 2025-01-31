import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleRequest {
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
  type: 'decode' | 'recalls' | 'safety' | 'complaints';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, vin, make, model, year } = await req.json() as VehicleRequest;
    let url = '';
    
    switch (type) {
      case 'decode':
        url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
        break;
      case 'recalls':
        url = vin 
          ? `https://api.nhtsa.gov/recalls/recallsByVehicle?vin=${vin}`
          : `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&model=${model}&modelYear=${year}`;
        break;
      case 'safety':
        url = `https://api.nhtsa.gov/SafetyRatings/VehicleId/${year}/${make}/${model}`;
        break;
      case 'complaints':
        url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${make}&model=${model}&modelYear=${year}`;
        break;
      default:
        throw new Error('Invalid request type');
    }

    console.log(`Fetching vehicle information from: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log('NHTSA API Response:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching vehicle information:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch vehicle information' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});