import { NextRequest, NextResponse } from "next/server";
import { sameOrigin, setEixoCookies, signIn, verifyEixoMember } from "../_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Requisição inválida."},{status:403});
  if(Number(request.headers.get("content-length")||0)>4000)return NextResponse.json({message:"Dados inválidos."},{status:413});
  try{
    const body=await request.json() as {email?:unknown;password?:unknown};
    const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
    const password=typeof body.password==="string"?body.password:"";
    if(!/^\S+@\S+\.\S+$/.test(email)||email.length>254||password.length<6||password.length>128){
      return NextResponse.json({message:"Informe um e-mail e uma senha válidos."},{status:400});
    }
    const tokens=await signIn(email,password);
    if(!tokens)return NextResponse.json({message:"E-mail ou senha inválidos."},{status:401});
    const member=await verifyEixoMember(tokens.access_token);
    if(!member){
      // Even a legitimate account from another product on this Supabase has no EIXO privileges.
      return NextResponse.json({message:"Ainda não identificamos uma compra ativa do Método EIXO para este acesso. Confira o e-mail da compra."},{status:403});
    }
    const response=NextResponse.json({ok:true,redirect:"/app"},{headers:{"Cache-Control":"no-store"}});
    setEixoCookies(response,tokens);
    return response;
  }catch(error){
    console.error("EIXO auth unavailable:",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não foi possível acessar o serviço agora. Tente novamente."},{status:503});
  }
}
