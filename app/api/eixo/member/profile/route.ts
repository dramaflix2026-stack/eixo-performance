import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {currentEixoSession,sameOrigin,setEixoCookies} from "../../auth/_lib";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
const goals=["confianca","presenca","dialogo","rotina"];
function config(){
 const url=process.env.EIXO_SUPABASE_URL?.replace(/\/$/,"");
 const key=process.env.EIXO_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw Error("not configured");
 return {url,key};
}
function adult(birthDate:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(birthDate))return false;
 const date=new Date(birthDate+"T12:00:00Z");
 if(Number.isNaN(date.valueOf())||date.toISOString().slice(0,10)!==birthDate)return false;
 const now=new Date();
 let age=now.getUTCFullYear()-date.getUTCFullYear();
 if((now.getUTCMonth()+1)<(date.getUTCMonth()+1)||((now.getUTCMonth()+1)===(date.getUTCMonth()+1)&&now.getUTCDate()<date.getUTCDate()))age--;
 return age>=18&&age<=100;
}
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Origem inválida."},{status:403,headers:noStore});
 if(Number(request.headers.get("content-length")||0)>2000)return NextResponse.json({message:"Dados inválidos."},{status:413,headers:noStore});
 try{
  const session=await currentEixoSession();
  if(!session)return NextResponse.json({message:"Acesso não autorizado."},{status:401,headers:noStore});
  const token=session.tokens?.access_token||(await cookies()).get("eixo_member_access")?.value;
  if(!token)return NextResponse.json({message:"Sessão inválida."},{status:401,headers:noStore});
  const input=await request.json() as {fullName?:unknown;birthDate?:unknown;primaryGoal?:unknown;dailyMinutes?:unknown;agree?:unknown};
  const fullName=typeof input.fullName==="string"?input.fullName.trim().replace(/\s+/g," "):"";
  const birthDate=typeof input.birthDate==="string"?input.birthDate:"";
  const primaryGoal=typeof input.primaryGoal==="string"?input.primaryGoal:"";
  const dailyMinutes=Number(input.dailyMinutes);
  if(fullName.length<3||fullName.length>120||!adult(birthDate)||!goals.includes(primaryGoal)||![5,10,15,20].includes(dailyMinutes)||input.agree!==true){
   return NextResponse.json({message:"Confira nome, data de nascimento (18+) e preferências. Para salvar, aceite o armazenamento do perfil."},{status:400,headers:noStore});
  }
  const {url,key}=config();
  const result=await fetch(url+"/rest/v1/eixo_member_profiles?on_conflict=user_id",{
   method:"POST",
   headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=minimal"},
   body:JSON.stringify({user_id:session.user.id,full_name:fullName,birth_date:birthDate,primary_goal:primaryGoal,daily_minutes:dailyMinutes,updated_at:new Date().toISOString()}),
   cache:"no-store",signal:AbortSignal.timeout(10000)
  });
  if(!result.ok)throw Error("profile upsert failed "+result.status);
  const response=NextResponse.json({ok:true},{headers:noStore});
  if(session.tokens)setEixoCookies(response,session.tokens);
  return response;
 }catch(error){
  console.error("EIXO profile save error",error instanceof Error?error.message:"unknown");
  return NextResponse.json({message:"Não conseguimos salvar o seu perfil agora. Tente novamente."},{status:503,headers:noStore});
 }
}
