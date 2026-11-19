"use client";

import Link from "next/link";
import {useCallback,useEffect,useMemo,useState} from "react";
import "./app.css";
import {MemberOnboarding,type MemberProfile} from "./member-onboarding";
import {MemberCatalog} from "./member-catalog";
import {EixoMemberCalendar,EixoCalendarPreview} from "./member-calendar";
import {EixoJourney} from "./member-journey";
import {EixoMediaLibrary} from "./media-library";
import {EixoContextualInsights} from "./member-insights";
import {EixoTraining} from "./member-training";
import {EixoNutrition} from "./member-nutrition";
import {EixoExperienceHub,EixoSos} from "./experience-hub";

type Lesson={day:number;phase:string;title:string;estimatedMinutes:number;intro:string;steps:{title:string;description:string}[];closing:string};
type Bonus={id:number;title:string;subtitle:string;duration:string;sections:{title:string;paragraphs:string[]}[]};
type Dashboard={email:string;memberRole?:"student"|"admin_master";profile:MemberProfile|null;completedDays:number[];lessons:Lesson[];bonuses:Bonus[];notice:string};
type Tab="inicio"|"catalogo"|"roteiro"|"bonus"|"calendario"|"progresso"|"midia"|"orientacoes"|"treinos"|"alimentacao"|"perfil"|"ferramentas"|"sos";
const NAV:[Tab,string,string][]=[["inicio","Início","⌂"],["catalogo","Explorar","▤"],["roteiro","Minha Jornada","◈"],["calendario","Meu Diário","▦"],["ferramentas","Ferramentas","✦"],["perfil","Meu Perfil","◎"]];

function Logo(){return <Link href="/" className="eixo-member-logo" aria-label="Método EIXO">EI<span>X</span>O<span className="eixo-member-logo-dot">.</span></Link>}

export default function EixoMembersPage(){
  const [data,setData]=useState<Dashboard|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [savedError,setSavedError]=useState("");
  const [savingDay,setSavingDay]=useState<number|null>(null);
  const [tab,setTab]=useState<Tab>("inicio");
  const [selectedDay,setSelectedDay]=useState(1);
  const [selectedBonus,setSelectedBonus]=useState<number|null>(null);

  const load=useCallback(async()=>{
    setLoading(true);
    setError("");
    try{
      const response=await fetch("/api/eixo/member/dashboard",{cache:"no-store",credentials:"same-origin"});
      if(response.status===401){window.location.replace("/login?acesso=necessario");return;}
      if(!response.ok)throw new Error("Falha ao carregar o painel");
      const json=await response.json() as Dashboard;
      if(!Array.isArray(json.lessons)||!Array.isArray(json.bonuses)||!Array.isArray(json.completedDays))throw new Error("Resposta inválida");
      setData(json);
    }catch{setError("Não foi possível carregar seus conteúdos agora. Tente novamente.");}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{void load();},[load]);

  const completed=data?.completedDays||[];
  const percent=Math.round(completed.length/7*100);
  const currentDay=useMemo(()=>{
    for(let n=1;n<=7;n++)if(!completed.includes(n))return n;
    return 7;
  },[completed]);
  const lesson=data?.lessons.find(l=>l.day===selectedDay);
  const bonus=data?.bonuses.find(b=>b.id===selectedBonus);
  async function toggleCompletion(day:number){
    if(!data||savingDay!==null)return;
    const done=!completed.includes(day);
    setSavingDay(day);
    setSavedError("");
    try{
      const response=await fetch("/api/eixo/member/progress",{
        method:"POST",credentials:"same-origin",cache:"no-store",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({day,completed:done})
      });
      if(response.status===401){window.location.replace("/login?acesso=necessario");return;}
      if(!response.ok)throw Error("save failed");
      setData(prev=>prev?{...prev,completedDays:done?[...prev.completedDays,day].sort((a,b)=>a-b):prev.completedDays.filter(n=>n!==day)}:prev);
    }catch{setSavedError("Não conseguimos salvar sua marcação. Tente novamente.");}
    finally{setSavingDay(null);}
  }
  async function logout(){
    try{await fetch("/api/eixo/auth/logout",{method:"POST",credentials:"same-origin"});}catch{}
    window.location.replace("/login");
  }
  function openLesson(day:number){setSelectedDay(day);setSelectedBonus(null);setTab("roteiro");window.scrollTo({top:0,behavior:"smooth"});}
  function openBonus(id:number){setSelectedBonus(id);setTab("bonus");window.scrollTo({top:0,behavior:"smooth"});}

  return <main className="eixo-member-page">
    <header className="eixo-member-header">
      <div className="eixo-member-header-inner"><Logo/><div className="eixo-member-header-right"><span className="eixo-member-member-chip"><span/> {data?.memberRole==="admin_master"?"ADMIN MESTRE":"ACESSO AUTORIZADO"}</span><button onClick={logout} className="eixo-member-exit">Sair <span aria-hidden="true">↗</span></button></div></div>
    </header>
    {loading?<div className="eixo-member-loading" role="status"><span className="eixo-member-loader"/> Preparando seu espaço EIXO...</div>:
      error||!data?<div className="eixo-member-failure"><h1>Não foi possível entrar na área.</h1><p>{error||"Tente novamente."}</p><button onClick={()=>void load()}>Tentar novamente →</button></div>:
      !data.profile?<MemberOnboarding onComplete={load}/>:
      <>
        <section className="eixo-member-overline"><span>✦ EIXO / ESPAÇO PRIVADO</span><span>UMA JORNADA NO SEU RITMO</span></section>
        <section className="eixo-member-heading">
          <div><span className="eixo-member-kicker">BEM-VINDO DE VOLTA · {data.profile.fullName.split(" ")[0].toUpperCase()}</span><h1>Seu espaço.<br/><em>Seu ritmo.</em></h1><p>Um catálogo de experiências e orientações para explorar no seu tempo. O que importa aqui é cuidar de você, sem competir com ninguém.</p></div>
          <div className="eixo-member-profile-stat"><div className="eixo-member-progress-ring" style={{"--p":percent+"%"} as React.CSSProperties}><strong>{percent}%</strong><small>CONCLUÍDO</small></div><strong>Seu progresso</strong><span>{completed.length} de 7 etapas realizadas</span></div>
        </section>
        <nav className="eixo-member-tabs" aria-label="Navegação da área de membros">
          {NAV.map(([key,label,symbol])=><button key={key} type="button" className={tab===key?"active":""} onClick={()=>{setTab(key);setSelectedBonus(null);}} aria-current={tab===key?"page":undefined}><span aria-hidden="true">{symbol}</span> {label}</button>)}
        </nav>
        <div className="eixo-member-content">
          {(tab==="inicio"||tab==="catalogo")&&<section className="eixo-member-home" aria-label="Biblioteca e jornada do Método EIXO">
            <MemberCatalog firstName={data.profile.fullName.split(" ")[0]} goal={data.profile.primaryGoal}
              completedDays={completed} lessons={data.lessons} bonuses={data.bonuses}
              onOpenLesson={openLesson} onOpenBonus={openBonus}
              checkinPreview={<EixoCalendarPreview openCalendar={()=>{setTab("calendario");window.scrollTo({top:0,behavior:"smooth"});}}/>}/>
          </section>}
          {tab==="roteiro"&&<section className="eixo-member-learn" aria-labelledby="eixo-member-learn-title">
            <div className="eixo-member-section-heading"><span>02 / SEU ROTEIRO</span><h2 id="eixo-member-learn-title">Sete dias para <em>se observar.</em></h2><p>Abra cada dia para ler as orientações e marque como concluído quando terminar.</p></div>
            <div className="eixo-member-learn-layout">
              <div className="eixo-member-day-list" aria-label="Dias do roteiro">{data.lessons.map(day=><button type="button" key={day.day} onClick={()=>setSelectedDay(day.day)} className={selectedDay===day.day?"selected":""} aria-current={selectedDay===day.day?"step":undefined}><span className="eixo-member-day-index">{String(day.day).padStart(2,"0")}</span><span className="eixo-member-day-label"><small>{day.phase}</small><strong>{day.title}</strong></span>{completed.includes(day.day)?<span className="eixo-member-day-check" title="Concluído">✓</span>:<span aria-hidden="true" className="eixo-member-day-chevron">→</span>}</button>)}</div>
              {lesson&&<article className="eixo-member-lesson" key={lesson.day}><span className="eixo-member-lesson-topline">DIA {String(lesson.day).padStart(2,"0")} DE 07 <span>◷ {lesson.estimatedMinutes} MIN</span></span><h3>{lesson.title}</h3><p className="eixo-member-lesson-intro">{lesson.intro}</p><div className="eixo-member-lesson-items">{lesson.steps.map((step,index)=><div key={index}><span className="eixo-member-lesson-step-index">{String(index+1).padStart(2,"0")}</span><div><h4>{step.title}</h4><p>{step.description}</p></div></div>)}</div><div className="eixo-member-lesson-closing">✦ {lesson.closing}</div>{savedError&&<p role="alert" className="eixo-member-save-error">{savedError}</p>}<button className="eixo-member-primary eixo-member-complete" disabled={savingDay!==null} onClick={()=>void toggleCompletion(lesson.day)}>{savingDay===lesson.day?"SALVANDO...":completed.includes(lesson.day)?"✓ DIA CONCLUÍDO · DESMARCAR":"MARCAR ESTE DIA COMO CONCLUÍDO"}<span>→</span></button></article>}
            </div>
          </section>}
          {tab==="bonus"&&<section className="eixo-member-bonuses" aria-labelledby="eixo-member-bonuses-title">
            <div className="eixo-member-section-heading"><span>03 / MATERIAIS COMPLEMENTARES</span><h2 id="eixo-member-bonuses-title">Mais ferramentas. <em>Menos pressão.</em></h2><p>Os cinco materiais estão disponíveis para leitura dentro da sua área.</p></div>
            {bonus?<article className="eixo-member-bonus-detail"><button className="eixo-member-back" onClick={()=>setSelectedBonus(null)}>← Voltar aos bônus</button><span className="eixo-member-kicker">BÔNUS {String(bonus.id).padStart(2,"0")} / 05 · {bonus.duration}</span><h3>{bonus.title}</h3><p className="eixo-member-bonus-intro">{bonus.subtitle}</p>{bonus.sections.map((part,i)=><section key={i} className="eixo-member-bonus-part"><h4>{part.title}</h4>{part.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</section>)}<button className="eixo-member-primary" onClick={()=>setSelectedBonus(null)}>VER OS DEMAIS BÔNUS <span>↗</span></button></article>:
            <div className="eixo-member-bonus-grid">{data.bonuses.map(b=><button className="eixo-member-bonus-card" key={b.id} onClick={()=>openBonus(b.id)}><span className="eixo-member-bonus-numeral">{String(b.id).padStart(2,"0")}</span><span className="eixo-member-bonus-card-text"><small>BÔNUS INCLUÍDO · {b.duration}</small><strong>{b.title}</strong><span>{b.subtitle}</span><em>ABRIR MATERIAL <span>↗</span></em></span></button>)}</div>}
          </section>}
          {tab==="calendario"&&<EixoMemberCalendar/>}
          {tab==="progresso"&&<EixoJourney lessons={data.lessons} completedDays={completed} onOpenLesson={openLesson}/>}
          {tab==="midia"&&<EixoMediaLibrary/>}
          {tab==="orientacoes"&&<EixoContextualInsights profile={data.profile} completedDays={completed} onOpenLesson={openLesson} onOpenCalendar={()=>setTab("calendario")}/>}
          {tab==="ferramentas"&&<EixoExperienceHub onOpen={id=>{setTab(id);window.scrollTo({top:0,behavior:"smooth"});}}/>}
          {tab==="sos"&&<EixoSos/>}
          {(["sos","orientacoes","treinos","alimentacao"] as Tab[]).includes(tab)&&<button type="button" className="eixo-member-back" onClick={()=>setTab("ferramentas")}>← Voltar às ferramentas</button>}
          {tab==="treinos"&&<EixoTraining dailyMinutes={data.profile.dailyMinutes}/>}
          {tab==="alimentacao"&&<EixoNutrition/>}
          {tab==="perfil"&&<section className="eixo-member-profile" aria-label="Editar meus dados">
            <div className="eixo-member-section-heading"><span>07 / CONTA E PREFERÊNCIAS</span><h2>Meu perfil <em>privado.</em></h2><p>Você pode atualizar seus dados pessoais e o foco das orientações quando quiser. Informações de saúde ou intimidade não são solicitadas aqui.</p></div>
            <MemberOnboarding initial={data.profile} onComplete={async()=>{await load();setTab("inicio");}}/>
          </section>}
        </div>
        <aside className="eixo-member-privacy"><span>◈</span><p><strong>Seu espaço é privado.</strong> Dias concluídos e registros do calendário ficam associados à sua conta com permissões individuais. Os registros íntimos são opcionais e podem ser excluídos. O EIXO não usa estes dados para diagnósticos.</p></aside>
        <footer className="eixo-member-footer"><span>© MÉTODO EIXO</span><span>{data.email}</span><span>Conteúdo educativo · Não substitui atendimento profissional</span></footer>
      </>}
  </main>;
}
