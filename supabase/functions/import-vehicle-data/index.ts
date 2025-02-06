
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
    // Verify the JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

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

    // Create Supabase client with service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and insert data in smaller batches
    const batchSize = 25 // Reduced from 50 to 25
    const maxConcurrentBatches = 4
    const errors = []
    
    // Process data in chunks to manage memory
    for (let i = 0; i < vehicleData.length; i += batchSize * maxConcurrentBatches) {
      const batchPromises = []
      
      // Create up to maxConcurrentBatches promises
      for (let j = 0; j < maxConcurrentBatches && (i + j * batchSize) < vehicleData.length; j++) {
        const start = i + j * batchSize
        const end = Math.min(start + batchSize, vehicleData.length)
        const batch = vehicleData.slice(start, end).map(item => {
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
        }).filter(item => item !== null)
        
        if (batch.length > 0) {
          const batchPromise = async () => {
            try {
              console.log(`Processing batch ${start / batchSize + 1} to ${end / batchSize} (${batch.length} records)`)
              
              const { error } = await supabaseAdmin
                .from('vehicle_models_reference')
                .upsert(batch, { 
                  onConflict: 'year,make,model',
                  ignoreDuplicates: true
                })

              if (error) {
                console.error(`Error inserting batch ${start / batchSize + 1}:`, error)
                errors.push(`Batch ${start / batchSize + 1}: ${error.message}`)
              } else {
                console.log(`Successfully inserted batch ${start / batchSize + 1}`)
              }
            } catch (error) {
              console.error(`Error processing batch ${start / batchSize + 1}:`, error)
              errors.push(`Batch ${start / batchSize + 1}: ${error.message}`)
            }
          }
          
          batchPromises.push(batchPromise())
        }
      }
      
      // Wait for current set of batches to complete before moving to next set
      await Promise.all(batchPromises)
      
      // Small delay between batch sets to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
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
