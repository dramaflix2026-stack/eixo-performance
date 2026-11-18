import {NextRequest,NextResponse} from "next/server";
import {sameOrigin} from "../_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
const callback="https://eixo-performance-production.up.railway.app/login?eixo=acesso";

export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers});
  if(Number(request.headers.get("content-length")||0)>2000)return NextResponse.json({message:"Dados inválidos."},{status:413,headers});
  try{
    const body=await request.json() as {email?:unknown;password?:unknown;confirmPassword?:unknown};
    const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
    const password=typeof body.password==="string"?body.password:"";
    const confirmPassword=typeof body.confirmPassword==="string"?body.confirmPassword:"";
    if(email.length>254||!/^\S+@\S+\.\S+$/.test(email)){
      return NextResponse.json({message:"Informe um e-mail válido."},{status:400,headers});
    }
    if(!password||password.length>128){
      return NextResponse.json({message:"Informe uma senha válida."},{status:400,headers});
    }
    if(password!==confirmPassword){
      return NextResponse.json({message:"As duas senhas estão diferentes. Confira e tente novamente."},{status:400,headers});
    }
    const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
    const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
    if(!url||!key)throw Error("EIXO auth not configured");
    // EIXO signup is tagged so the Toledo-specific profile trigger is skipped.
    // This tag is NOT used as authorization to access any paid content.
    const result=await fetch(url+"/auth/v1/signup?redirect_to="+encodeURIComponent(callback),{
      method:"POST",
      headers:{apikey:key,"Content-Type":"application/json"},
      body:JSON.stringify({email,password,data:{app:"eixo"}}),
      cache:"no-store",
      signal:AbortSignal.timeout(12000)
    });
    if(result.status===429){
      return NextResponse.json({message:"Muitas solicitações. Aguarde alguns minutos e tente novamente."},{status:429,headers});
    }
    if(!result.ok){
      const details=await result.json().catch(()=>({})) as {msg?:string;message?:string;error_code?:string};
      const code=details.error_code||"";
      console.warn("EIXO signup rejected",result.status,code);
      if(code==="weak_password"||/password.*(?:short|least|characters)/i.test(details.msg||details.message||"")){
        return NextResponse.json({message:"O Supabase não aceitou essa senha. Ele aplica uma regra própria de segurança; escolha uma senha um pouco maior."},{status:400,headers});
      }
      if(code==="email_address_invalid")return NextResponse.json({message:"O e-mail informado não é aceito. Verifique o endereço."},{status:400,headers});
      if(result.status===400)return NextResponse.json({message:"Não foi possível cadastrar este e-mail. Verifique se os dados estão corretos."},{status:400,headers});
      return NextResponse.json({message:"Não foi possível enviar a confirmação neste momento. Tente novamente."},{status:503,headers});
    }
    return NextResponse.json({ok:true,message:"Cadastro solicitado! Enviamos as instruções para seu e-mail. Clique no link de confirmação e volte aqui para entrar com sua senha. Se esse e-mail já estiver cadastrado, utilize o login ou a recuperação de acesso."},{headers});
  }catch(error){
    console.error("EIXO signup error",error instanceof Error?error.name:"unknown");
    return NextResponse.json({message:"O serviço de cadastro está indisponível agora."},{status:503,headers});
  }
}
