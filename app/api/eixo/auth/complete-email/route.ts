import {NextRequest,NextResponse} from "next/server";
import {sameOrigin,setEixoCookies,verifyEixoMember} from "../_lib";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers});
 if(process.env.EIXO_REGISTRATION_ENABLED!=="true")return NextResponse.json({message:"Confirmação ainda em preparação."},{status:503,headers});
 if(Number(request.headers.get("content-length")||0)>9000)return NextResponse.json({message:"Dados inválidos."},{status:413,headers});
 try{
   const body=await request.json() as {access_token?:unknown;refresh_token?:unknown;expires_in?:unknown;type?:unknown};
   const accessToken=typeof body.access_token==="string"?body.access_token:"";
   const refreshToken=typeof body.refresh_token==="string"?body.refresh_token:"";
   const expiresIn=Number(body.expires_in)||3600;
   if(accessToken.length<60||accessToken.length>6000||refreshToken.length<15||refreshToken.length>3000)
     return NextResponse.json({message:"Link inválido ou expirado."},{status:400,headers});
   const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
   const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
   if(!url||!key)throw Error("EIXO auth not configured");
   const checked=await fetch(url+"/auth/v1/user",{
     headers:{apikey:key,Authorization:"Bearer "+accessToken},cache:"no-store",signal:AbortSignal.timeout(12000)
   });
   if(!checked.ok)return NextResponse.json({message:"Não foi possível validar o link. Solicite um novo."},{status:401,headers});
   const user=await checked.json() as {id?:unknown;email_confirmed_at?:unknown};
   if(typeof user.id!=="string"||!user.email_confirmed_at)
     return NextResponse.json({message:"O e-mail ainda não foi confirmado."},{status:401,headers});
   const member=await verifyEixoMember(accessToken);
   if(!member)return NextResponse.json({
     ok:true,verified:true,authorized:false,
     message:"E-mail confirmado! Sua conta já existe, mas a área do EIXO será liberada quando a compra aprovada for registrada."
   },{headers});
   const result=NextResponse.json({ok:true,verified:true,authorized:true,redirect:"/app"},{headers});
   setEixoCookies(result,{access_token:accessToken,refresh_token:refreshToken,expires_in:Math.max(60,Math.min(3600,expiresIn))});
   return result;
 }catch(error){
   console.error("EIXO link completion error",error instanceof Error?error.message:"unknown");
   return NextResponse.json({message:"Não foi possível confirmar o link agora."},{status:503,headers});
 }
}
