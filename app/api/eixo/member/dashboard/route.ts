import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {currentEixoSession,setEixoCookies,sameOrigin} from "../../auth/_lib";
import {EIXO_LESSONS,EIXO_BONUSES} from "../_content";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
function apiConfig(){
 const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
 const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw Error("not configured");
 return {url,key};
}

export async function GET(){
  try{
    const session=await currentEixoSession();
    if(!session)return NextResponse.json({message:"É necessário entrar na sua conta."},{status:401,headers:noStore});
    const token=session.tokens?.access_token||(await cookies()).get("eixo_member_access")?.value;
    if(!token)return NextResponse.json({message:"Sessão inválida."},{status:401,headers:noStore});
    const {url,key}=apiConfig();
    const authHeaders={apikey:key,Authorization:"Bearer "+token};
    const [req,profileReq]=await Promise.all([
      fetch(url+"/rest/v1/eixo_day_progress?select=day_number&user_id=eq."+encodeURIComponent(session.user.id),{
        headers:authHeaders,cache:"no-store",signal:AbortSignal.timeout(10000)
      }),
      fetch(url+"/rest/v1/eixo_member_profiles?select=full_name,birth_date,primary_goal,daily_minutes&user_id=eq."+encodeURIComponent(session.user.id)+"&limit=1",{
        headers:authHeaders,cache:"no-store",signal:AbortSignal.timeout(10000)
      })
    ]);
    if(!req.ok)throw Error("progress fetch failed "+req.status);
    if(!profileReq.ok)throw Error("profile fetch failed "+profileReq.status);
    const rows=await req.json() as Array<{day_number:number}>;
    const profiles=await profileReq.json() as Array<{full_name:string;birth_date:string;primary_goal:string;daily_minutes:number}>;
    const done=rows.map(x=>x.day_number).filter(x=>Number.isInteger(x)&&x>=1&&x<=7);
    const response=NextResponse.json({
      email:session.user.email||"",
      memberRole:session.user.memberRole||"student",
      profile:profiles[0]?{
        fullName:profiles[0].full_name,birthDate:profiles[0].birth_date,
        primaryGoal:profiles[0].primary_goal,dailyMinutes:profiles[0].daily_minutes
      }:null,
      completedDays:done,
      lessons:EIXO_LESSONS,
      bonuses:EIXO_BONUSES,
      notice:"Conteúdo educativo: não substitui uma avaliação médica ou psicológica."
    },{headers:noStore});
    if(session.tokens)setEixoCookies(response,session.tokens);
    return response;
  }catch(error){
    console.error("EIXO dashboard error",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Não foi possível carregar sua área. Tente novamente."},{status:503,headers:noStore});
  }
}
