
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Import vehicle data function started')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received request to import vehicle data')
    const { vehicleData, organizationId } = await req.json()
    
    console.log('Received data:', {
      organizationId,
      dataLength: vehicleData?.length || 0,
      sampleData: vehicleData?.[0]
    })

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and insert data in batches
    const batchSize = 100 // Reduced batch size for better error handling
    const batches = []
    const errors = []
    
    for (let i = 0; i < vehicleData.length; i += batchSize) {
      const batch = vehicleData.slice(i, i + batchSize).map(item => ({
        year: parseInt(item.year),
        make: item.make?.trim(),
        model: item.model?.trim(),
        organization_id: organizationId
      }))
      
      batches.push(batch)
    }

    console.log(`Processing ${batches.length} batches of vehicle data`)

    // Insert batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`Inserting batch ${i + 1} of ${batches.length} (${batch.length} records)`)
      
      const { error } = await supabaseClient
        .from('vehicle_models_reference')
        .upsert(batch, { 
          onConflict: 'year,make,model',
          ignoreDuplicates: true // Ignore rather than update duplicates
        })

      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error)
        errors.push(`Batch ${i + 1}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      throw new Error(`Some batches failed to import: ${errors.join('; ')}`)
    }

    console.log('Successfully imported all vehicle data')

    return new Response(
      JSON.stringify({ message: 'Vehicle data imported successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error importing vehicle data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
