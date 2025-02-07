
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { HmacSHA256 } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getAmzDate() {
  const date = new Date();
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

async function generateSignature(stringToSign: string, secretKey: string, date: string) {
  const dateKey = await new HmacSHA256('AWS4' + secretKey, date.substring(0, 8)).digest();
  const regionKey = await new HmacSHA256(dateKey, 'us-west-2').digest();
  const serviceKey = await new HmacSHA256(regionKey, 'ProductAdvertisingAPI').digest();
  const signingKey = await new HmacSHA256(serviceKey, 'aws4_request').digest();
  return new HmacSHA256(signingKey, stringToSign).toString();
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const { keywords, marketplace = 'US' } = await req.json();
    if (!keywords) {
      throw new Error('Keywords are required');
    }

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

    // Prepare the request
    const host = 'webservices.amazon.com';
    const region = 'us-west-2';
    const service = 'ProductAdvertisingAPI';
    const amzDate = getAmzDate();
    const dateStamp = amzDate.substring(0, 8);

    const payload = JSON.stringify({
      "Keywords": keywords,
      "Resources": [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ],
      "PartnerTag": associateTag,
      "PartnerType": "Associates",
      "Marketplace": "www.amazon.com"
    });

    const canonicalUri = '/paapi5/searchitems';
    const canonicalQueryString = '';
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

    const canonicalHeaders = 
      'content-encoding:amz-1.0\n' +
      'content-type:application/json; charset=utf-8\n' +
      `host:${host}\n` +
      `x-amz-date:${amzDate}\n` +
      'x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n';

    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      await new HmacSHA256().update(payload).digest('hex')
    ].join('\n');

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      await new HmacSHA256().update(canonicalRequest).digest('hex')
    ].join('\n');

    const signature = await generateSignature(stringToSign, secretKey, dateStamp);

    const authorizationHeader = 
      `${algorithm} ` +
      `Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    // Make the request to Amazon
    const response = await fetch(`https://${host}${canonicalUri}`, {
      method: 'POST',
      headers: {
        'Content-Encoding': 'amz-1.0',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Date': amzDate,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        'Authorization': authorizationHeader,
        'Host': host
      },
      body: payload
    });

    const data = await response.json();

    // Log the request for tracking
    await supabase.from('amazon_api_requests').insert({
      organization_id: profile.organization_id,
      request_type: 'search',
      status: response.status,
      keywords: keywords
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
