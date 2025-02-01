import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleRequest {
  type: 'recalls' | 'safety' | 'complaints' | 'decode';
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json() as VehicleRequest;
    const { type, vin, make, model, year } = requestData;
    let url = '';
    
    console.log('Request parameters:', { type, vin, make, model, year });
    
    switch (type) {
      case 'decode':
        if (!vin) {
          throw new Error('VIN is required for decoding');
        }
        url = `https://api.nhtsa.gov/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`;
        break;

      case 'recalls':
        if (vin) {
          url = `https://api.nhtsa.gov/recalls/recallsByVIN/${encodeURIComponent(vin)}`;
        } else if (make && model && year) {
          url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        } else {
          throw new Error('Insufficient vehicle information for recall search');
        }
        break;
        
      case 'safety':
        if (!make || !model || !year) {
          throw new Error('Make, model, and year are required for safety ratings');
        }
        url = `https://api.nhtsa.gov/SafetyRatings/vehicle/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`;
        break;
        
      case 'complaints':
        if (!make || !model || !year) {
          throw new Error('Make, model, and year are required for complaints');
        }
        url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        break;
        
      default:
        throw new Error(`Invalid request type: ${type}`);
    }

    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('NHTSA API Response:', data);

    // Return the appropriate response based on request type
    if (type === 'decode') {
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform recall data to match our expected format
    if (type === 'recalls') {
      const results = data.results || [];
      return new Response(
        JSON.stringify({
          Count: results.length,
          results: results.map((recall: any) => ({
            ReportReceivedDate: recall.ReportReceivedDate || recall.reportReceivedDate,
            Component: recall.Component || recall.component,
            Summary: recall.Summary || recall.summary,
            Consequence: recall.Consequence || recall.consequence,
            Remedy: recall.Remedy || recall.remedy,
            Notes: recall.Notes || recall.notes,
            NHTSACampaignNumber: recall.NHTSACampaignNumber || recall.nhtsaCampaignNumber,
            ManufacturerRecallNumber: recall.ManufacturerRecallNumber || recall.manufacturerCampaignNumber
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