import { NextRequest, NextResponse } from "next/server";
import { clearEixoCookies, sameOrigin } from "../_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Requisição inválida."},{status:403});
  const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
  clearEixoCookies(response);
  return response;
}
