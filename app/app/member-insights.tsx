"use client";
import {useMemo,useState} from "react";
import type {MemberProfile} from "./member-onboarding";
import "./insights.css";
type Props={profile:MemberProfile;completedDays:number[];onOpenLesson:(day:number)=>void;onOpenCalendar:()=>void};
const suggestions:Record<string,{heading:string;body:string}>={
 confianca:{heading:"Confiança se constrói com gentileza.",body:"Observe suas expectativas e valorize pequenos passos, sem exigir um resultado imediato."},
 presenca:{heading:"Presença é uma prática cotidiana.",body:"Reserve alguns minutos para notar a respiração, as sensações e o ambiente ao redor."},
 dialogo:{heading:"Conexão começa com conversa.",body:"Escolha um momento tranquilo para expressar necessidades e escutar sem pressa."},
 rotina:{heading:"Sua rotina também merece cuidado.",body:"Descanso, movimento e pausas podem fazer parte de um cotidiano mais equilibrado."}
};
function ageRange(birthDate:string){
 const d=new Date(birthDate+"T12:00:00Z");if(!Number.isFinite(d.getTime()))return null;
 const now=new Date();let age=now.getUTCFullYear()-d.getUTCFullYear();
 if(now.getUTCMonth()<d.getUTCMonth()||(now.getUTCMonth()===d.getUTCMonth()&&now.getUTCDate()<d.getUTCDate()))age--;
 if(age<18||age>100)return null;
 return age<30?"18–29":age<45?"30–44":age<60?"45–59":"60+";
}
export function EixoContextualInsights({profile,completedDays,onOpenLesson,onOpenCalendar}:Props){
 const [showAge,setShowAge]=useState(false);
 const completed=new Set(completedDays);
 const next=Array.from({length:7},(_,i)=>i+1).find(day=>!completed.has(day));
 const range=useMemo(()=>ageRange(profile.birthDate),[profile.birthDate]);
 const focus=suggestions[profile.primaryGoal]||suggestions.rotina;
 return <section className="eixo-insights" aria-labelledby="eixo-insights-title">
  <header><span>06 / ORIENTAÇÕES CONTEXTUAIS</span><h2 id="eixo-insights-title">Uma orientação <em>para o seu momento.</em></h2><p>Mensagens educativas selecionadas a partir do foco que você escolheu e das etapas concluídas. Sem análise de informações íntimas.</p></header>
  <div className="eixo-insights-grid">
   <article className="eixo-insights-feature"><span>✦ SEU FOCO ATUAL</span><h3>{focus.heading}</h3><p>{focus.body}</p><button onClick={()=>onOpenLesson(next??1)}>{next?"EXPLORAR PRÓXIMA ETAPA":"REVISITAR A JORNADA"} ↗</button></article>
   <article className="eixo-insights-card"><span>◈ SUA JORNADA</span><h3>{completed.size===0?"Todo começo conta.":completed.size>=7?"Você completou o roteiro.":"Você está construindo sua jornada."}</h3><p>{completed.size===0?"Explore a primeira atividade quando desejar.":completed.size>=7?"Revisite as atividades que mais fizeram sentido para você.":`Você marcou ${completed.size} de 7 etapas como concluídas. Siga no seu próprio ritmo.`}</p><button onClick={()=>onOpenLesson(next??1)}>ABRIR JORNADA ↗</button></article>
   <article className="eixo-insights-card"><span>◷ SEU TEMPO</span><h3>Uma pausa também é cuidado.</h3><p>Você reservou {profile.dailyMinutes} minutos como preferência diária. Isso é uma intenção, não uma obrigação ou meta clínica.</p><button onClick={onOpenCalendar}>ABRIR MEU CALENDÁRIO ↗</button></article>
  </div>
  <div className="eixo-insights-age"><div><strong>Contexto por faixa etária</strong><p>Se desejar, veja uma orientação geral por idade. Sua data de nascimento não é enviada a nenhum serviço externo.</p></div><button type="button" aria-expanded={showAge} onClick={()=>setShowAge(v=>!v)}>{showAge?"OCULTAR":"VER ORIENTAÇÃO"}</button></div>
  {showAge&&<p className="eixo-insights-age-detail">Faixa etária: {range||"não disponível"}. Independentemente da idade adulta, sono, comunicação, bem-estar e autocuidado podem ser explorados sem metas de desempenho. Necessidades individuais variam e dúvidas persistentes devem ser discutidas com um profissional qualificado.</p>}
  <p className="eixo-insights-disclaimer">Estas mensagens são geradas por regras transparentes de personalização, não por um modelo de IA generativa. Não analisam o diário íntimo, não realizam diagnósticos e não inferem resultados de saúde.</p>
 </section>;
}
