// Server-only EIXO auth bridge. Never expose the Supabase key through NEXT_PUBLIC_.
import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_COOKIE="eixo_member_access";
const REFRESH_COOKIE="eixo_member_refresh";

type SupabaseUser={id:string;email?:string};
type SupabaseTokens={access_token:string;refresh_token:string;expires_in:number};
export type EixoSession={user:SupabaseUser;tokens:SupabaseTokens|null};

function config(){
  const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
  const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new Error("EIXO_SUPABASE_NOT_CONFIGURED");
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url))throw new Error("EIXO_SUPABASE_INVALID_URL");
  return {url,key};
}

async function api(path:string,init:RequestInit={},accessToken?:string){
  const {url,key}=config();
  const headers=new Headers(init.headers);
  headers.set("apikey",key);
  if(accessToken)headers.set("Authorization",`Bearer ${accessToken}`);
  if(init.body)headers.set("Content-Type","application/json");
  return fetch(url+path,{...init,headers,cache:"no-store",signal:AbortSignal.timeout(12000)});
}

export async function signIn(email:string,password:string):Promise<SupabaseTokens|null>{
  const response=await api("/auth/v1/token?grant_type=password",{
    method:"POST",body:JSON.stringify({email,password})
  });
  if(!response.ok)return null;
  const data=await response.json() as Partial<SupabaseTokens>;
  if(typeof data.access_token!=="string"||typeof data.refresh_token!=="string")return null;
  return {access_token:data.access_token,refresh_token:data.refresh_token,expires_in:Math.max(60,Number(data.expires_in)||3600)};
}

async function refreshAccess(refreshToken:string):Promise<SupabaseTokens|null>{
  const response=await api("/auth/v1/token?grant_type=refresh_token",{
    method:"POST",body:JSON.stringify({refresh_token:refreshToken})
  });
  if(!response.ok)return null;
  const data=await response.json() as Partial<SupabaseTokens>;
  if(typeof data.access_token!=="string"||typeof data.refresh_token!=="string")return null;
  return {access_token:data.access_token,refresh_token:data.refresh_token,expires_in:Math.max(60,Number(data.expires_in)||3600)};
}

export async function verifyEixoMember(accessToken:string):Promise<SupabaseUser|null>{
  // GoTrue verifies the JWT; then PostgREST checks the membership under RLS.
  const userResponse=await api("/auth/v1/user",{method:"GET"},accessToken);
  if(!userResponse.ok)return null;
  const user=await userResponse.json() as Partial<SupabaseUser>;
  if(typeof user.id!=="string"||!/^[0-9a-f-]{36}$/i.test(user.id))return null;

  // Buyers may confirm their email after Kiwify posts the purchase.
  // Claim only matching paid orders for a confirmed email, never by client metadata.
  // An existing active membership remains valid even if this optional claim fails.
  try{
    const claim=await api("/rest/v1/rpc/eixo_claim_verified_purchase",{
      method:"POST",body:"{}"
    },accessToken);
    if(!claim.ok)console.warn("EIXO purchase claim unavailable",claim.status);
  }catch{
    console.warn("EIXO purchase claim transiently unavailable");
  }

  const path="/rest/v1/eixo_memberships?select=user_id&user_id=eq."+
    encodeURIComponent(user.id)+"&status=eq.active&limit=1";
  const memberResponse=await api(path,{method:"GET"},accessToken);
  if(!memberResponse.ok)return null;
  const memberships=await memberResponse.json() as Array<{user_id:string}>;
  if(!Array.isArray(memberships)||memberships.length!==1||memberships[0].user_id!==user.id)return null;
  return {id:user.id,email:typeof user.email==="string"?user.email:undefined};
}

export async function currentEixoSession():Promise<EixoSession|null>{
  const jar=await cookies();
  const access=jar.get(ACCESS_COOKIE)?.value;
  if(access){
    const user=await verifyEixoMember(access);
    if(user)return {user,tokens:null};
  }
  const refresh=jar.get(REFRESH_COOKIE)?.value;
  if(!refresh)return null;
  const tokens=await refreshAccess(refresh);
  if(!tokens)return null;
  const user=await verifyEixoMember(tokens.access_token);
  return user?{user,tokens}:null;
}

export function setEixoCookies(response:NextResponse,tokens:SupabaseTokens){
  const secure=process.env.NODE_ENV==="production";
  response.cookies.set(ACCESS_COOKIE,tokens.access_token,{
    httpOnly:true,secure,sameSite:"lax",path:"/",
    maxAge:Math.max(60,Math.min(tokens.expires_in,3600))
  });
  response.cookies.set(REFRESH_COOKIE,tokens.refresh_token,{
    httpOnly:true,secure,sameSite:"lax",path:"/",
    maxAge:30*24*3600
  });
}

export function clearEixoCookies(response:NextResponse){
  const secure=process.env.NODE_ENV==="production";
  for(const name of [ACCESS_COOKIE,REFRESH_COOKIE]){
    response.cookies.set(name,"",{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:0});
  }
}

export function sameOrigin(request:Request):boolean{
  const origin=request.headers.get("origin");
  if(!origin)return false;
  try{
    return new URL(origin).host===new URL(request.url).host;
  }catch{return false;}
}
