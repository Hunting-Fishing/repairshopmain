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
        // First try VIN-based recall search
        if (vin) {
          console.log('Searching recalls by VIN:', vin);
          url = `https://api.nhtsa.gov/recalls/recallsByVIN/${vin}`;
        } else if (make && model && year) {
          // Fallback to make/model/year search
          console.log('Searching recalls by make/model/year:', { make, model, year });
          url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        } else {
          throw new Error('Insufficient vehicle information for recall search');
        }
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

    // Transform the recall data to match our expected format
    if (type === 'recalls') {
      // The API returns data in a nested structure
      const results = data.results || [];
      return new Response(
        JSON.stringify({
          Count: results.length,
          results: results.map((recall: any) => ({
            ...recall,
            RecallStatus: recall.completionDate ? 'Completed' : 'Incomplete',
            ReportReceivedDate: recall.reportReceivedDate || recall.reportDate,
            Component: recall.component,
            Summary: recall.summary,
            Consequence: recall.consequence,
            Remedy: recall.remedy,
            Notes: recall.notes,
            NHTSACampaignNumber: recall.nhtsaCampaignNumber,
            ManufacturerRecallNumber: recall.manufacturerCampaignNumber
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching vehicle information:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch vehicle information', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});