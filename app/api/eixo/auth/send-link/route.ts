import {NextRequest,NextResponse} from "next/server";
import {sameOrigin} from "../_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const responseHeaders={"Cache-Control":"no-store","Content-Type":"application/json; charset=utf-8"};
const loginRedirect="https://eixo-performance-production.up.railway.app/login?eixo=acesso";

export async function POST(request:NextRequest){
  if(!sameOrigin(request)){
    return NextResponse.json({message:"Origem não autorizada."},{status:403,headers:responseHeaders});
  }
  if(Number(request.headers.get("content-length")||0)>700){
    return NextResponse.json({message:"Dados inválidos."},{status:413,headers:responseHeaders});
  }

  let email:string;
  try{
    const body=await request.json() as {email?:unknown};
    email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
    if(email.length>254||!/^\S+@\S+\.\S+$/.test(email)){
      return NextResponse.json({message:"Informe um e-mail válido."},{status:400,headers:responseHeaders});
    }
  }catch{
    return NextResponse.json({message:"Dados inválidos."},{status:400,headers:responseHeaders});
  }

  const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
  const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key){
    return NextResponse.json({message:"Serviço de e-mail indisponível."},{status:503,headers:responseHeaders});
  }

  try{
    // Crucial: do NOT create an auth user on the shared Toledo project.
    // Only existing users receive this email; GoTrue rate limits requests.
    const response=await fetch(url+"/auth/v1/otp?redirect_to="+encodeURIComponent(loginRedirect),{
      method:"POST",
      headers:{"apikey":key,"Content-Type":"application/json"},
      body:JSON.stringify({email,create_user:false}),
      cache:"no-store",
      signal:AbortSignal.timeout(12000)
    });
    if(response.status===429){
      return NextResponse.json({message:"Você solicitou muitos links. Aguarde alguns minutos para tentar novamente."},{status:429,headers:responseHeaders});
    }
    if(!response.ok){
      const error=await response.json().catch(()=>({})) as {msg?:string;message?:string;error_description?:string;error_code?:string};
      const detail=[error.msg,error.message,error.error_description,error.error_code].filter(Boolean).join(" ");
      console.warn("EIXO email link rejected",response.status,error.error_code||"auth_error");
      if(/Email address not authorized|smtp|mailer|sending.*email|send.*email/i.test(detail)){
        return NextResponse.json({message:"O Supabase ainda não está autorizado a enviar e-mails para este endereço. Configure o SMTP do projeto para liberar o envio."},{status:503,headers:responseHeaders});
      }
      // Generic, to avoid revealing which email addresses are registered.
      return NextResponse.json({ok:true,message:"Se este e-mail já estiver cadastrado, tiver autorização de acesso e o serviço de envio estiver ativo, você receberá o link. Confira a caixa de entrada e o spam."},{headers:responseHeaders});
    }

    return NextResponse.json({ok:true,message:"Solicitação enviada ao Supabase. Se o endereço já estiver cadastrado e o envio estiver habilitado, o link chegará ao seu e-mail. Confira também o spam."},{headers:responseHeaders});
  }catch(error){
    console.error("EIXO email link request failed",error instanceof Error?error.name:"unknown");
    return NextResponse.json({message:"O serviço de envio de e-mail não respondeu. Tente novamente."},{status:503,headers:responseHeaders});
  }
}
