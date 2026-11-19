"use client";

import {useState,type FormEvent} from "react";
import "./onboarding.css";

export type MemberProfile={
 fullName:string;
 birthDate:string;
 primaryGoal:string;
 dailyMinutes:number;
};

const GOALS=[
 {id:"confianca",title:"Construir confiança",detail:"Reduzir a pressão e compreender minhas expectativas",symbol:"◈"},
 {id:"presenca",title:"Viver mais o presente",detail:"Estar atento ao momento e ao conforto",symbol:"✦"},
 {id:"dialogo",title:"Melhorar o diálogo",detail:"Conversar com mais clareza e menos vergonha",symbol:"↗"},
 {id:"rotina",title:"Cuidar da minha rotina",detail:"Organizar hábitos, descanso e autocuidado",symbol:"◷"}
];
export function MemberOnboarding({onComplete}:{onComplete:()=>Promise<void>}){
 const [step,setStep]=useState(1);
 const [fullName,setFullName]=useState("");
 const [birthDate,setBirthDate]=useState("");
 const [goal,setGoal]=useState("confianca");
 const [minutes,setMinutes]=useState(10);
 const [consent,setConsent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");

 function next(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const birthday=new Date(birthDate+"T12:00:00Z");
  if(Number.isNaN(birthday.valueOf())||birthday.toISOString().slice(0,10)!==birthDate){
   setMessage("Informe uma data de nascimento válida.");return;
  }
  const today=new Date();
  let age=today.getUTCFullYear()-birthday.getUTCFullYear();
  if((today.getUTCMonth()<birthday.getUTCMonth())||(today.getUTCMonth()===birthday.getUTCMonth()&&today.getUTCDate()<birthday.getUTCDate()))age--;
  if(age<18||age>100){setMessage("O Método EIXO é destinado a adultos a partir de 18 anos.");return;}
  if(fullName.trim().length<3){setMessage("Informe seu nome completo.");return;}
  setMessage("");setStep(2);
 }
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!consent){setMessage("Para salvar seu perfil, confirme que leu as informações de privacidade.");return;}
  setBusy(true);setMessage("");
  try{
   const r=await fetch("/api/eixo/member/profile",{
    method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",
    body:JSON.stringify({fullName:fullName.trim(),birthDate,primaryGoal:goal,dailyMinutes:minutes,agree:consent})
   });
   const result=await r.json() as {ok?:boolean;message?:string};
   if(!r.ok||!result.ok)throw Error(result.message||"Não foi possível salvar.");
   await onComplete();
  }catch(e){setMessage(e instanceof Error?e.message:"Não foi possível salvar. Tente novamente.");}
  finally{setBusy(false);}
 }
 return <section className="eixo-onboard" aria-labelledby="onboard-title">
  <div className="eixo-onboard-panel">
   <div className="eixo-onboard-brand">EI<span>X</span>O.</div>
   <div className="eixo-onboard-topline"><span>SEU ESPAÇO. DO SEU JEITO.</span><span>{String(step).padStart(2,"0")} / 02</span></div>
   <div className="eixo-onboard-track"><span style={{width:step===1?"50%":"100%"}}/></div>
   <div className="eixo-onboard-intro">
    <span>✦ CONFIGURAÇÃO INICIAL</span>
    <h1 id="onboard-title">{step===1?<>Antes de começar, <em>vamos nos conhecer.</em></>:<>O que faz sentido <em>para você?</em></>}</h1>
    <p>{step===1?"Vamos preparar sua área privada. Pedimos apenas algumas informações para personalizar a experiência.":"Escolha seu foco inicial. Você poderá explorar todos os conteúdos, independentemente da opção escolhida."}</p>
   </div>
   {step===1?<form onSubmit={next} className="eixo-onboard-form">
    <label htmlFor="eixo-fullname">Seu nome completo</label>
    <input id="eixo-fullname" autoComplete="name" placeholder="Como podemos chamar você?" maxLength={120} value={fullName} onChange={e=>setFullName(e.target.value)} required/>
    <label htmlFor="eixo-dob">Data de nascimento</label>
    <input id="eixo-dob" type="date" autoComplete="bday" value={birthDate} max={new Date().toISOString().slice(0,10)} onChange={e=>setBirthDate(e.target.value)} required/>
    <p className="eixo-onboard-help">A idade ajuda a contextualizar orientações gerais. Não realizamos diagnósticos nem comparamos seu desempenho com outras pessoas.</p>
    {message&&<p className="eixo-onboard-error" role="alert">{message}</p>}
    <button type="submit" className="eixo-onboard-action">CONTINUAR <span>→</span></button>
   </form>:<form onSubmit={submit} className="eixo-onboard-form">
    <label>Qual é o seu foco agora?</label>
    <div className="eixo-onboard-goals">{GOALS.map(item=><button type="button" key={item.id} className={goal===item.id?"active":""} onClick={()=>setGoal(item.id)} aria-pressed={goal===item.id}>
     <span className="eixo-onboard-goal-icon">{item.symbol}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className="eixo-onboard-choice">{goal===item.id?"✓":""}</span>
    </button>)}</div>
    <label htmlFor="eixo-daily-minutes">Quanto tempo você gostaria de reservar por dia?</label>
    <select id="eixo-daily-minutes" value={minutes} onChange={e=>setMinutes(Number(e.target.value))}>
      <option value={5}>5 minutos</option><option value={10}>10 minutos</option><option value={15}>15 minutos</option><option value={20}>20 minutos</option>
    </select>
    <label className="eixo-onboard-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Entendi que meu nome, data de nascimento e preferências serão armazenados em meu perfil privado para personalizar esta área. Não serão utilizados para diagnóstico, publicidade direcionada por saúde ou compartilhamento público.</span></label>
    {message&&<p className="eixo-onboard-error" role="alert">{message}</p>}
    <div className="eixo-onboard-actions"><button className="eixo-onboard-back" type="button" onClick={()=>{setStep(1);setMessage("");}}>← VOLTAR</button><button type="submit" className="eixo-onboard-action" disabled={busy}>{busy?"SALVANDO...":"ENTRAR NO MEU EIXO"} <span>→</span></button></div>
   </form>}
   <footer className="eixo-onboard-footer">◈ ACESSO PRIVADO · PROTEÇÃO INDIVIDUAL · PARA MAIORES DE 18 ANOS</footer>
  </div>
 </section>;
}
