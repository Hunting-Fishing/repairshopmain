
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";
import { corsHeaders } from "./utils/headers.ts";
import { getAmzDate } from "./utils/dates.ts";
import { generateSignature } from "./utils/crypto.ts";
import { buildAmazonPayload } from "./utils/amazon-payload.ts";

const encoder = new TextEncoder();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessKeyId = Deno.env.get('AMAZON_ACCESS_KEY_ID');
    const secretKey = Deno.env.get('AMAZON_SECRET_ACCESS_KEY');
    const associateTag = Deno.env.get('AMAZON_ASSOCIATE_TAG');

    if (!accessKeyId || !secretKey || !associateTag) {
      throw new Error('Missing required Amazon credentials');
    }

    const { keywords, asin, marketplace = 'CA' } = await req.json();

    // Get organization settings from Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's organization_id from the JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw userError;

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      throw new Error('Organization not found');
    }

    // Check and update request quota
    const { data: settings } = await supabase
      .from('amazon_associates_settings')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!settings?.tracking_enabled) {
      throw new Error('Amazon Associates integration is not enabled');
    }

    const host = 'webservices.amazon.ca';  // Changed to Canadian host
    const region = 'ca-central-1';  // Changed to Canadian region
    const service = 'ProductAdvertisingAPI';
    const amzDate = getAmzDate();
    const dateStamp = amzDate.substring(0, 8);
    
    const payload = JSON.stringify(buildAmazonPayload(associateTag, asin, keywords));
    const canonicalUri = '/paapi5/searchitems';
    const canonicalQueryString = '';
    const signedHeaders = 'content-encoding;host;x-amz-date;x-amz-target';
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const target = asin 
      ? 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems' 
      : 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';

    const canonicalHeaders = 
      'content-encoding:amz-1.0\n' +
      'host:' + host + '\n' +
      'x-amz-date:' + amzDate + '\n' +
      'x-amz-target:' + target + '\n';

    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      await crypto.subtle.digest('SHA-256', encoder.encode(payload)).then(hash => hexEncode(new Uint8Array(hash)))
    ].join('\n');

    console.log('Canonical Request:', canonicalRequest);

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest)).then(hash => hexEncode(new Uint8Array(hash)))
    ].join('\n');

    console.log('String to Sign:', stringToSign);

    const signature = await generateSignature(stringToSign, secretKey, dateStamp);

    console.log('Generated Signature:', signature);

    const authorizationHeader = 
      `${algorithm} ` +
      `Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    console.log('Making request to Amazon API...');
    console.log('Request URL:', `https://${host}${canonicalUri}`);
    console.log('Authorization Header:', authorizationHeader);
    console.log('Request payload:', payload);

    const response = await fetch(`https://${host}${canonicalUri}`, {
      method: 'POST',
      headers: {
        'Content-Encoding': 'amz-1.0',
        'Host': host,
        'X-Amz-Date': amzDate,
        'X-Amz-Target': target,
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: payload
    });

    console.log('Amazon API response status:', response.status);
    
    const data = await response.json();
    console.log('Amazon API response data:', JSON.stringify(data, null, 2));

    // Log the request for tracking
    await supabase.from('amazon_api_requests').insert({
      organization_id: profile.organization_id,
      request_type: asin ? 'get_item' : 'search',
      status: response.status,
      keywords: keywords || asin
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in amazon-product-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

