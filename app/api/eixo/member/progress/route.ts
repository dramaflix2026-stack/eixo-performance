import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {currentEixoSession,setEixoCookies,sameOrigin} from "../../auth/_lib";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers:noStore});
  if(Number(request.headers.get("content-length")||0)>500)return NextResponse.json({message:"Dados inválidos."},{status:413,headers:noStore});
  try{
    const session=await currentEixoSession();
    if(!session)return NextResponse.json({message:"Acesso não autorizado."},{status:401,headers:noStore});
    const token=session.tokens?.access_token||(await cookies()).get("eixo_member_access")?.value;
    if(!token)return NextResponse.json({message:"Sessão inválida."},{status:401,headers:noStore});
    const data=await request.json() as {day?:unknown;completed?:unknown};
    const day=data.day,completed=data.completed;
    if(typeof day!=="number"||!Number.isInteger(day)||day<1||day>7||typeof completed!=="boolean"){
      return NextResponse.json({message:"Dia inválido."},{status:400,headers:noStore});
    }
    const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
    const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
    if(!url||!key)throw Error("not configured");
    const base=url+"/rest/v1/eixo_day_progress";
    let db:Response;
    if(completed){
      db=await fetch(base,{
        method:"POST",
        headers:{apikey:key,Authorization:"Bearer "+token,
          "Content-Type":"application/json","Prefer":"resolution=ignore-duplicates,return=minimal"},
        body:JSON.stringify([{user_id:session.user.id,day_number:day}]),
        cache:"no-store",signal:AbortSignal.timeout(10000)
      });
    }else{
      db=await fetch(base+"?user_id=eq."+encodeURIComponent(session.user.id)+"&day_number=eq."+day,{
        method:"DELETE",
        headers:{apikey:key,Authorization:"Bearer "+token,"Prefer":"return=minimal"},
        cache:"no-store",signal:AbortSignal.timeout(10000)
      });
    }
    if(!db.ok)throw Error("progress mutation failed "+db.status);
    const response=NextResponse.json({ok:true,day,completed},{headers:noStore});
    if(session.tokens)setEixoCookies(response,session.tokens);
    return response;
  }catch(error){
    console.error("EIXO progress error",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não foi possível salvar seu progresso."},{status:503,headers:noStore});
  }
}
