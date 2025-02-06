
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
    
    // Log initial data received
    console.log('Received data:', {
      organizationId,
      dataLength: vehicleData?.length || 0,
      sampleData: vehicleData?.[0]
    })

    if (!Array.isArray(vehicleData)) {
      throw new Error('Vehicle data must be an array')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and insert data in batches
    const batchSize = 50 // Further reduced batch size
    const batches = []
    const errors = []
    
    for (let i = 0; i < vehicleData.length; i += batchSize) {
      const batch = vehicleData.slice(i, i + batchSize).map(item => {
        // Validate and clean data
        if (!item.year || !item.make || !item.model) {
          console.warn('Invalid item found:', item)
          return null
        }
        
        return {
          year: parseInt(item.year),
          make: item.make?.trim(),
          model: item.model?.trim(),
          organization_id: organizationId
        }
      }).filter(item => item !== null) // Remove invalid items
      
      if (batch.length > 0) {
        batches.push(batch)
      }
    }

    console.log(`Processing ${batches.length} batches of vehicle data`)

    // Insert batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`Inserting batch ${i + 1} of ${batches.length} (${batch.length} records)`)
      
      try {
        const { error } = await supabaseClient
          .from('vehicle_models_reference')
          .upsert(batch, { 
            onConflict: 'year,make,model',
            ignoreDuplicates: true
          })

        if (error) {
          console.error(`Error inserting batch ${i + 1}:`, error)
          errors.push(`Batch ${i + 1}: ${error.message}`)
        } else {
          console.log(`Successfully inserted batch ${i + 1}`)
        }
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error)
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
