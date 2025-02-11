
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Import job templates function started')

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

    console.log('Received request to import job templates')
    const { templatesData, organizationId } = await req.json()
    
    // Log initial data received
    console.log('Received data:', {
      organizationId,
      dataLength: templatesData?.length || 0,
      sampleData: templatesData?.[0]
    })

    if (!Array.isArray(templatesData)) {
      throw new Error('Templates data must be an array')
    }

    // Create Supabase client with service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and insert data in smaller batches
    const batchSize = 10
    const maxConcurrentBatches = 2
    const errors = []
    
    // Process data in chunks to manage memory
    for (let i = 0; i < templatesData.length; i += batchSize * maxConcurrentBatches) {
      const batchPromises = []
      
      // Create up to maxConcurrentBatches promises
      for (let j = 0; j < maxConcurrentBatches && (i + j * batchSize) < templatesData.length; j++) {
        const start = i + j * batchSize
        const end = Math.min(start + batchSize, templatesData.length)
        const batch = templatesData.slice(start, end).map(item => {
          if (!item.name || !item.category || !item.description) {
            console.warn('Invalid template found:', item)
            return null
          }
          
          return {
            name: item.name?.trim(),
            category: item.category?.trim().toLowerCase(),
            description: item.description?.trim(),
            estimated_hours: item.estimated_hours || null,
            parts_required: item.parts_required || null,
            job_number: item.job_number || null,
            sub_tasks: item.sub_tasks || null,
            timeline: item.timeline || null,
            organization_id: organizationId,
            is_active: true,
            status: item.status || 'pending'
          }
        }).filter(item => item !== null)
        
        if (batch.length > 0) {
          const batchPromise = async () => {
            try {
              console.log(`Processing batch ${start / batchSize + 1} to ${end / batchSize} (${batch.length} records)`)
              
              const { error } = await supabaseAdmin
                .from('job_templates')
                .upsert(batch, { 
                  onConflict: 'name,organization_id',
                  ignoreDuplicates: false
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
      
      // Add delay between batch sets to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    if (errors.length > 0) {
      throw new Error(`Some batches failed to import: ${errors.join('; ')}`)
    }

    console.log('Successfully imported all job templates')

    return new Response(
      JSON.stringify({ message: 'Job templates imported successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error importing job templates:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
