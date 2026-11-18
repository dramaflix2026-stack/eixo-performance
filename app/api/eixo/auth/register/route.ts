import {NextRequest,NextResponse} from "next/server";
import {sameOrigin} from "../_lib";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers});
 // EIXO signup on a shared Toledo Auth database would auto-create active laboratory profiles.
 // ONLY turn on in a dedicated Auth project, never in the current shared project.
 if(process.env.EIXO_REGISTRATION_ENABLED!=="true")
   return NextResponse.json({message:"O primeiro acesso ainda está sendo preparado para manter seus dados separados dos outros sistemas. O login existente permanece disponível."},{status:503,headers});
 if(Number(request.headers.get("content-length")||0)>1200)return NextResponse.json({message:"Dados inválidos."},{status:413,headers});
 try{
   const body=await request.json() as {email?:unknown;password?:unknown};
   const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
   const password=typeof body.password==="string"?body.password:"";
   if(email.length>254||!/^\S+@\S+\.\S+$/.test(email)||password.length<10||password.length>128)
     return NextResponse.json({message:"Informe e-mail válido e senha com pelo menos dez caracteres."},{status:400,headers});
   const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
   const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
   if(!url||!key)throw Error("EIXO auth not configured");
   const redirect=encodeURIComponent("https://eixo-performance-production.up.railway.app/login?eixo=confirmado");
   const response=await fetch(url+"/auth/v1/signup?redirect_to="+redirect,{
     method:"POST",headers:{apikey:key,"Content-Type":"application/json"},
     body:JSON.stringify({email,password,data:{app:"eixo"}}),cache:"no-store",signal:AbortSignal.timeout(12000)
   });
   if(response.status===429)return NextResponse.json({message:"Muitas tentativas. Aguarde antes de tentar novamente."},{status:429,headers});
   if(!response.ok){console.warn("EIXO signup request status",response.status);return NextResponse.json({message:"Não foi possível enviar a confirmação. Confira os dados e tente novamente."},{status:503,headers});}
   return NextResponse.json({ok:true,message:"Se o e-mail for elegível e a configuração de envio estiver ativa, você receberá uma mensagem para confirmar a conta. Confira também o spam."},{headers});
 }catch(error){console.error("EIXO signup error",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"O serviço de cadastro está indisponível agora."},{status:503,headers});}
}
