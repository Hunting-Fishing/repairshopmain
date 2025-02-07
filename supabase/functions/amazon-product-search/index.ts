
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encoder = new TextEncoder();

function getAmzDate() {
  const date = new Date();
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

async function hmacSHA256(key: string | ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const keyBuffer = key instanceof ArrayBuffer ? key : encoder.encode(key);
  const messageBuffer = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
}

async function generateSignature(stringToSign: string, secretKey: string, date: string) {
  const kDate = await hmacSHA256('AWS4' + secretKey, date.substring(0, 8));
  const kRegion = await hmacSHA256(kDate, 'us-west-2');
  const kService = await hmacSHA256(kRegion, 'ProductAdvertisingAPI');
  const kSigning = await hmacSHA256(kService, 'aws4_request');
  const signature = await hmacSHA256(kSigning, stringToSign);
  return hexEncode(new Uint8Array(signature));
}

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

    const { keywords = "digital camera", marketplace = 'US' } = await req.json();

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

    const host = 'webservices.amazon.com';
    const region = 'us-west-2';
    const service = 'ProductAdvertisingAPI';
    const amzDate = getAmzDate();
    const dateStamp = amzDate.substring(0, 8);

    const payload = JSON.stringify({
      "Keywords": keywords,
      "SearchIndex": "Photo",
      "Resources": [
        "Images.Primary.Large",
        "Images.Primary.Medium",
        "Images.Variants.Large",
        "ItemInfo.Title",
        "ItemInfo.Features",
        "ItemInfo.ProductInfo",
        "ItemInfo.ByLineInfo",
        "ItemInfo.ContentInfo",
        "ItemInfo.ManufactureInfo",
        "ItemInfo.TechnicalInfo",
        "Offers.Listings.Price",
        "Offers.Listings.DeliveryInfo.IsPrimeEligible",
        "Offers.Listings.Promotions",
        "Offers.Summaries"
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
      await crypto.subtle.digest('SHA-256', encoder.encode(payload)).then(hash => hexEncode(new Uint8Array(hash)))
    ].join('\n');

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest)).then(hash => hexEncode(new Uint8Array(hash)))
    ].join('\n');

    const signature = await generateSignature(stringToSign, secretKey, dateStamp);

    const authorizationHeader = 
      `${algorithm} ` +
      `Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    console.log('Making request to Amazon API for cameras...');

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

    console.log('Amazon API response status:', response.status);

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
