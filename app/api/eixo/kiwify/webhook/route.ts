import {createHmac,timingSafeEqual} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=30;

const jsonHeaders={"Cache-Control":"no-store","Content-Type":"application/json; charset=utf-8"};

function response(ok:boolean,status=200,detail?:string){
  return NextResponse.json({ok,...(detail?{detail}:{})},{status,headers:jsonHeaders});
}
type SaleEvent={
  order_id?:unknown;
  order_status?:unknown;
  webhook_event_type?:unknown;
  Product?:{product_id?:unknown;product_name?:unknown};
  Customer?:{email?:unknown};
  Commissions?:{charge_amount?:unknown};
};
function normalizedName(name:unknown){
  return typeof name==="string"?
    name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/\s+/g," "):"";
}
function classify(event:SaleEvent):"approved"|"refunded"|"chargeback"|null{
  const type=String(event.webhook_event_type||"").trim().toLowerCase();
  const orderStatus=String(event.order_status||"").trim().toLowerCase();
  if(type==="order_approved"&&orderStatus==="paid")return "approved";
  if(type==="order_refunded"||orderStatus==="refunded")return "refunded";
  if(type.includes("chargeback")||["chargeback","chargedback"].includes(orderStatus))return "chargeback";
  return null;
}

export async function POST(request:NextRequest){
  const signingToken=process.env.EIXO_KIWIFY_WEBHOOK_TOKEN;
  const ingestToken=process.env.EIXO_KIWIFY_INGEST_SECRET;
  const supabaseUrl=process.env.EIXO_SUPABASE_URL;
  if(!signingToken||!ingestToken||!supabaseUrl)return response(false,503,"not_configured");

  const claimedSignature=request.nextUrl.searchParams.get("signature")?.toLowerCase()||"";
  if(!/^[0-9a-f]{40}$/.test(claimedSignature))return response(false,401,"invalid_signature");
  if(Number(request.headers.get("content-length")||0)>65536)return response(false,413,"oversized_payload");

  let rawBody:string;
  try{rawBody=await request.text();}catch{return response(false,400,"invalid_payload");}
  if(!rawBody||Buffer.byteLength(rawBody,"utf8")>65536)return response(false,413,"oversized_payload");

  // The Kiwify signature is an HMAC-SHA1 of the ORIGINAL raw JSON body.
  const expected=createHmac("sha1",signingToken).update(rawBody,"utf8").digest();
  const received=Buffer.from(claimedSignature,"hex");
  if(received.length!==expected.length||!timingSafeEqual(received,expected)){
    return response(false,401,"invalid_signature");
  }
  let event:SaleEvent;
  try{
    const parsed:unknown=JSON.parse(rawBody);
    if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return response(false,400,"invalid_payload");
    event=parsed as SaleEvent;
  }catch{return response(false,400,"invalid_json");}
  const status=classify(event);
  if(!status)return response(true,200,"event_ignored");

  // Only EIXO sales; never give access for other Kiwify products.
  const productId=typeof event.Product?.product_id==="string"?event.Product.product_id.trim():"";
  const expectedProductId=process.env.EIXO_KIWIFY_PRODUCT_ID?.trim();
  if(expectedProductId){
    if(productId!==expectedProductId)return response(true,200,"other_product_ignored");
  }else if(!normalizedName(event.Product?.product_name).startsWith("metodo eixo")){
    return response(true,200,"other_product_ignored");
  }

  const orderId=typeof event.order_id==="string"?event.order_id.trim():"";
  const email=typeof event.Customer?.email==="string"?event.Customer.email.trim().toLowerCase():"";
  if(!/^[a-zA-Z0-9_-]{6,128}$/.test(orderId)
    ||email.length>254||!/^\S+@\S+\.\S+$/.test(email)){
    return response(false,422,"missing_order_or_buyer");
  }
  const charge=event.Commissions?.charge_amount;
  let amountCents:number|null=null;
  if(typeof charge==="number"&&Number.isInteger(charge)&&charge>=0)amountCents=charge;
  if(typeof charge==="string"&&/^\d{1,9}$/.test(charge))amountCents=Number(charge);

  // Service-to-service API; only the backend knows the random ingest secret.
  // The Supabase function verifies its SHA-256 fingerprint and performs the atomic DB update.
  try{
    const edge=await fetch(supabaseUrl.replace(/\/$/,"")+"/functions/v1/eixo-kiwify-ingest",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-eixo-ingest-secret":ingestToken},
      body:JSON.stringify({orderId,email,status,amountCents}),
      cache:"no-store",
      signal:AbortSignal.timeout(15000)
    });
    if(!edge.ok){
      console.error("EIXO Kiwify ingest failed",edge.status);
      return response(false,503,"storage_unavailable");
    }
    return response(true,200,"processed");
  }catch(error){
    console.error("EIXO Kiwify ingest unreachable",error instanceof Error?error.name:"unknown");
    return response(false,503,"storage_unavailable");
  }
}

export async function GET(){
  return NextResponse.json({service:"eixo-kiwify-webhook",status:"online",secure:true},{headers:jsonHeaders});
}
