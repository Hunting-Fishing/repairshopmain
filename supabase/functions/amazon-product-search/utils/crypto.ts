
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const encoder = new TextEncoder();

export async function hmacSHA256(key: string | ArrayBuffer, message: string): Promise<ArrayBuffer> {
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

export async function generateSignature(stringToSign: string, secretKey: string, date: string) {
  const kDate = await hmacSHA256('AWS4' + secretKey, date.substring(0, 8));
  const kRegion = await hmacSHA256(kDate, 'us-west-2');
  const kService = await hmacSHA256(kRegion, 'ProductAdvertisingAPI');
  const kSigning = await hmacSHA256(kService, 'aws4_request');
  const signature = await hmacSHA256(kSigning, stringToSign);
  return hexEncode(new Uint8Array(signature));
}

