import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {currentEixoSession,sameOrigin,setEixoCookies} from "../../auth/_lib";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
type Entry={
  entry_date:string;
  did_exercise:boolean|null;
  had_intimacy:boolean|null;
  intimacy_minutes:number|null;
  mood:string|null;
};

function settings(){
  const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
  const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw Error("EIXO database unavailable");
  return {url,key};
}
function validDate(date:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
  const parsed=new Date(date+"T12:00:00Z");
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date)return false;
  const today=new Date().toISOString().slice(0,10);
  return date>="2020-01-01"&&date<=today;
}
async function authorize(){
  const session=await currentEixoSession();
  if(!session)return null;
  const token=session.tokens?.access_token||(await cookies()).get("eixo_member_access")?.value;
  if(!token)return null;
  const {url,key}=settings();
  return {session,token,url,key};
}
function resultWithCookie(payload:object,auth:NonNullable<Awaited<ReturnType<typeof authorize>>>){
  const result=NextResponse.json(payload,{headers:noStore});
  if(auth.session.tokens)setEixoCookies(result,auth.session.tokens);
  return result;
}

export async function GET(request:NextRequest){
  try{
    const auth=await authorize();
    if(!auth)return NextResponse.json({message:"Faça login para abrir seu calendário."},{status:401,headers:noStore});
    const month=request.nextUrl.searchParams.get("month")||"";
    if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month))return NextResponse.json({message:"Mês inválido."},{status:400,headers:noStore});
    const start=month+"-01";
    const [y,m]=month.split("-").map(Number);
    const next=(m===12?y+1:y)+"-"+String(m===12?1:m+1).padStart(2,"0")+"-01";
    const qs=new URLSearchParams({select:"entry_date,did_exercise,had_intimacy,intimacy_minutes,mood",
      user_id:"eq."+auth.session.user.id,entry_date:"gte."+start,"entry_date.lt":next});
    // PostgREST needs two filters for the same column; URLSearchParams supports them.
    qs.delete("entry_date.lt");
    const query="user_id=eq."+encodeURIComponent(auth.session.user.id)+
      "&entry_date=gte."+start+"&entry_date=lt."+next+
      "&select=entry_date,did_exercise,had_intimacy,intimacy_minutes,mood&order=entry_date.asc";
    const response=await fetch(auth.url+"/rest/v1/eixo_private_checkins?"+query,{
      headers:{apikey:auth.key,Authorization:"Bearer "+auth.token},cache:"no-store",signal:AbortSignal.timeout(12000)
    });
    if(!response.ok)throw Error("Calendar read error "+response.status);
    const rows=await response.json() as Entry[];
    return resultWithCookie({entries:rows.map(r=>({date:r.entry_date,didExercise:r.did_exercise,
      hadIntimacy:r.had_intimacy,durationMinutes:r.intimacy_minutes,mood:r.mood}))},auth);
  }catch(error){
    console.error("EIXO calendar read error",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não conseguimos carregar o calendário."},{status:503,headers:noStore});
  }
}

export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Origem não autorizada."},{status:403,headers:noStore});
  if(Number(request.headers.get("content-length")||0)>1200)return NextResponse.json({message:"Registro excedeu o limite."},{status:413,headers:noStore});
  try{
    const auth=await authorize();
    if(!auth)return NextResponse.json({message:"Acesso não autorizado."},{status:401,headers:noStore});
    const value=await request.json() as Record<string,unknown>;
    const date=typeof value.date==="string"?value.date:"";
    const didExercise=value.didExercise===null?null:value.didExercise;
    const hadIntimacy=value.hadIntimacy===null?null:value.hadIntimacy;
    const mood=value.mood===null?null:value.mood;
    const duration=value.durationMinutes===null||value.durationMinutes===undefined?null:value.durationMinutes;
    if(!validDate(date)||!([null,true,false] as unknown[]).includes(didExercise)||
      !([null,true,false] as unknown[]).includes(hadIntimacy)||
      !([null,"calmo","confiante","ansioso","cansado","neutro"] as unknown[]).includes(mood)||
      (didExercise===null&&hadIntimacy===null&&mood===null)||
      (duration!==null&&(!Number.isInteger(duration)||Number(duration)<1||Number(duration)>180||hadIntimacy!==true))||
      value.consent!==true){
      return NextResponse.json({message:"Confira o dia, os campos e a autorização para salvar os registros privados."},{status:400,headers:noStore});
    }
    const row={
      user_id:auth.session.user.id,entry_date:date,did_exercise:didExercise,
      had_intimacy:hadIntimacy,intimacy_minutes:duration,mood,
      consent_at:new Date().toISOString(),updated_at:new Date().toISOString()
    };
    const response=await fetch(auth.url+"/rest/v1/eixo_private_checkins?on_conflict=user_id,entry_date",{
      method:"POST",
      headers:{apikey:auth.key,Authorization:"Bearer "+auth.token,"Content-Type":"application/json",
        Prefer:"resolution=merge-duplicates,return=minimal"},
      body:JSON.stringify(row),cache:"no-store",signal:AbortSignal.timeout(12000)
    });
    if(!response.ok)throw Error("Calendar write error "+response.status);
    return resultWithCookie({ok:true},auth);
  }catch(error){
    console.error("EIXO calendar write error",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não conseguimos salvar seu registro. Tente novamente."},{status:503,headers:noStore});
  }
}

export async function DELETE(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({message:"Origem não autorizada."},{status:403,headers:noStore});
  try{
    const auth=await authorize();
    if(!auth)return NextResponse.json({message:"Acesso não autorizado."},{status:401,headers:noStore});
    const body=await request.json() as {date?:unknown;all?:unknown;confirm?:unknown};
    let query="user_id=eq."+encodeURIComponent(auth.session.user.id);
    if(body.all===true){
      if(body.confirm!=="EXCLUIR TODOS")return NextResponse.json({message:"Confirmação necessária."},{status:400,headers:noStore});
    }else{
      if(typeof body.date!=="string"||!validDate(body.date))return NextResponse.json({message:"Dia inválido."},{status:400,headers:noStore});
      query+="&entry_date=eq."+body.date;
    }
    const response=await fetch(auth.url+"/rest/v1/eixo_private_checkins?"+query,{
      method:"DELETE",
      headers:{apikey:auth.key,Authorization:"Bearer "+auth.token,Prefer:"return=minimal"},
      cache:"no-store",signal:AbortSignal.timeout(12000)
    });
    if(!response.ok)throw Error("Calendar deletion error "+response.status);
    return resultWithCookie({ok:true},auth);
  }catch(error){
    console.error("EIXO calendar delete error",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não conseguimos excluir o registro."},{status:503,headers:noStore});
  }
}
