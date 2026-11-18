import {NextRequest,NextResponse} from "next/server";
import {sameOrigin} from "../_lib";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers});
 if(process.env.EIXO_REGISTRATION_ENABLED!=="true")
   return NextResponse.json({message:"A recuperação por e-mail ainda não está disponível enquanto preparamos o isolamento das contas EIXO."},{status:503,headers});
 if(Number(request.headers.get("content-length")||0)>700)return NextResponse.json({message:"Dados inválidos."},{status:413,headers});
 try{
   const {email}=await request.json() as {email?:unknown};
   if(typeof email!=="string"||email.length>254||!/^\S+@\S+\.\S+$/.test(email.trim()))
     return NextResponse.json({message:"Informe um e-mail válido."},{status:400,headers});
   const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
   const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
   if(!url||!key)throw Error("EIXO auth not configured");
   const redirect=encodeURIComponent("https://eixo-performance-production.up.railway.app/login?eixo=redefinir");
   const response=await fetch(url+"/auth/v1/recover?redirect_to="+redirect,{
     method:"POST",headers:{apikey:key,"Content-Type":"application/json"},
     body:JSON.stringify({email:email.trim().toLowerCase()}),cache:"no-store",signal:AbortSignal.timeout(12000)
   });
   if(response.status===429)return NextResponse.json({message:"Muitas solicitações. Aguarde um pouco."},{status:429,headers});
   if(!response.ok){console.warn("EIXO recovery status",response.status);return NextResponse.json({message:"Não foi possível solicitar a recuperação agora."},{status:503,headers});}
   return NextResponse.json({ok:true,message:"Se esta conta existir e tiver acesso, enviaremos instruções para o e-mail informado."},{headers});
 }catch(error){console.error("EIXO recovery error",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Serviço indisponível. Tente novamente."},{status:503,headers});}
}
