import { NextResponse } from "next/server";
import { clearEixoCookies, currentEixoSession, setEixoCookies } from "../_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(){
  try{
    const session=await currentEixoSession();
    if(!session){
      const response=NextResponse.json({authenticated:false},{status:401,headers:{"Cache-Control":"no-store"}});
      clearEixoCookies(response);
      return response;
    }
    const response=NextResponse.json({authenticated:true,email:session.user.email??null},{headers:{"Cache-Control":"no-store"}});
    if(session.tokens)setEixoCookies(response,session.tokens);
    return response;
  }catch(error){
    console.error("EIXO session unavailable:",error instanceof Error?error.message:"unknown");
    return NextResponse.json({authenticated:false},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
