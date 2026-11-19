"use client";

import {useCallback,useEffect,useMemo,useState,type FormEvent} from "react";
import "./calendar.css";

type Mood="calmo"|"confiante"|"ansioso"|"cansado"|"neutro";
type CalendarEntry={date:string;didExercise:boolean|null;hadIntimacy:boolean|null;durationMinutes:number|null;mood:Mood|null};
type Choice=boolean|null;
const moods:{id:Mood;label:string;icon:string}[]=[
 {id:"calmo",label:"Tranquilo",icon:"◡"},{id:"confiante",label:"Confiante",icon:"✦"},
 {id:"ansioso",label:"Ansioso",icon:"◇"},{id:"cansado",label:"Cansado",icon:"◷"},
 {id:"neutro",label:"Neutro",icon:"·"}
];
function iso(d:Date){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
function monthOf(d:Date){return iso(d).slice(0,7);}
const currentDate=()=>new Date();
const monthLabel=(key:string)=>new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date(Number(key.slice(0,4)),Number(key.slice(5,7))-1,1,12));
const dateLabel=(key:string)=>new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(new Date(Number(key.slice(0,4)),Number(key.slice(5,7))-1,Number(key.slice(8,10)),12));
function nextMonth(key:string,offset:number){const y=Number(key.slice(0,4)),m=Number(key.slice(5,7));const d=new Date(y,m-1+offset,1,12);return monthOf(d);}
function useCalendar(month:string){
 const [entries,setEntries]=useState<CalendarEntry[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const reload=useCallback(async(signal?:AbortSignal)=>{
  setLoading(true);setError("");
  try{
   const r=await fetch("/api/eixo/member/calendar?month="+encodeURIComponent(month),{credentials:"same-origin",cache:"no-store",signal});
   if(r.status===401){window.location.replace("/login?acesso=necessario");return;}
   const d=await r.json() as {entries?:CalendarEntry[];message?:string};
   if(!r.ok||!Array.isArray(d.entries))throw new Error(d.message||"Falha ao carregar.");
   if(!signal?.aborted)setEntries(d.entries);
  }catch(e){
   if(!signal?.aborted)setError(e instanceof Error?e.message:"Não foi possível carregar.");
  }finally{if(!signal?.aborted)setLoading(false);}
 },[month]);
 useEffect(()=>{const c=new AbortController();void reload(c.signal);return()=>c.abort();},[reload]);
 return {entries,setEntries,loading,error,reload};
}

export function EixoCalendarPreview({openCalendar}:{openCalendar:()=>void}){
 const month=monthOf(currentDate());
 const today=iso(currentDate());
 const {entries,loading,error}=useCalendar(month);
 const todaysEntry=entries.find(e=>e.date===today);
 const workouts=entries.filter(e=>e.didExercise===true).length;
 return <section className="eixo-calendar-preview" aria-label="Resumo do calendário e check-in de hoje">
   <div className="eixo-calendar-preview-left">
     <span className="eixo-calendar-eyebrow">03 / SEU DIA NO EIXO</span>
     <h3>Como foi seu <em>dia?</em></h3>
     <p>Registre atividade física e bem-estar. Se desejar, adicione informações de intimidade em uma área privada.</p>
     <button type="button" onClick={openCalendar} className="eixo-calendar-action">◈ {todaysEntry?"VER REGISTRO DE HOJE":"FAZER MEU CHECK-IN"} <span>↗</span></button>
   </div>
   <div className="eixo-calendar-preview-stats">
     <div><span>REGISTROS NO MÊS</span><strong>{loading?"—":entries.length}</strong></div>
     <div><span>DIAS COM EXERCÍCIOS</span><strong>{loading?"—":workouts}</strong></div>
     <div className="eixo-calendar-preview-status"><span>HOJE</span><strong>{todaysEntry?"✓ Registrado":"Sem registro"}</strong></div>
     {error&&<small role="status">Não foi possível carregar o resumo agora.</small>}
   </div>
 </section>;
}

function ChoicePair({value,onChange,label}:{value:Choice;onChange:(v:Choice)=>void;label:string}){
 return <fieldset className="eixo-calendar-choice-field">
  <legend>{label}</legend>
  <div className="eixo-calendar-choice-options">
   <button type="button" className={value===true?"active":""} aria-pressed={value===true} onClick={()=>onChange(value===true?null:true)}>Sim</button>
   <button type="button" className={value===false?"active":""} aria-pressed={value===false} onClick={()=>onChange(value===false?null:false)}>Não</button>
   <button type="button" className={value===null?"active muted":""} aria-pressed={value===null} onClick={()=>onChange(null)}>Não informar</button>
  </div>
 </fieldset>;
}

export function EixoMemberCalendar(){
 const today=iso(currentDate());
 const [month,setMonth]=useState(()=>monthOf(currentDate()));
 const [selected,setSelected]=useState(today);
 const {entries,setEntries,loading,error,reload}=useCalendar(month);
 const [exercise,setExercise]=useState<Choice>(null);
 const [intimacy,setIntimacy]=useState<Choice>(null);
 const [duration,setDuration]=useState("");
 const [mood,setMood]=useState<Mood|null>(null);
 const [consent,setConsent]=useState(false);
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState("");
 const [messageOk,setMessageOk]=useState(false);
 const selectedEntry=entries.find(x=>x.date===selected);
 useEffect(()=>{
  const row=entries.find(x=>x.date===selected);
  setExercise(row?.didExercise??null);
  setIntimacy(row?.hadIntimacy??null);
  setDuration(row?.durationMinutes?String(row.durationMinutes):"");
  setMood(row?.mood??null);
  setConsent(false);
 },[selected,entries]);
 const days=useMemo(()=>{
  const year=Number(month.slice(0,4)),index=Number(month.slice(5,7))-1;
  const count=new Date(year,index+1,0).getDate();
  const firstWeekday=new Date(year,index,1,12).getDay();
  return {count,firstWeekday};
 },[month]);
 const monthEntries=entries.length;
 const activityDays=entries.filter(x=>x.didExercise===true).length;
 const intimacyDays=entries.filter(x=>x.hadIntimacy===true).length;
 const calmDays=entries.filter(x=>x.mood==="calmo"||x.mood==="confiante").length;
 const moodMessage=monthEntries===0
   ?"Seu ponto de partida é simples: registre como você se sentiu, sem obrigação de preencher todos os dias."
   :activityDays>0&&calmDays>0
    ?"Você registrou movimento e momentos de tranquilidade neste mês. Observe sua rotina com curiosidade, sem atribuir causas ou cobrar resultados."
    :monthEntries>=4
     ?"Você já fez alguns registros. Consistência não significa perfeição: observe suas experiências no seu ritmo."
     :"Cada registro ajuda você a recordar sua rotina. Não existe uma frequência ideal para seguir.";
 const canNext=nextMonth(month,1)<=monthOf(currentDate());
 function navigate(offset:number){
  const target=nextMonth(month,offset);
  if(target<"2020-01"||target>monthOf(currentDate()))return;
  setMonth(target);
  setMessage("");
  setSelected(target===monthOf(currentDate())?iso(currentDate()):target+"-01");
 }
 async function save(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(saving)return;
  if(exercise===null&&intimacy===null&&mood===null){setMessageOk(false);setMessage("Escolha pelo menos uma informação para registrar.");return;}
  if(!consent){setMessageOk(false);setMessage("Confirme que deseja salvar essas informações privadas.");return;}
  const minutes=intimacy===true&&duration.trim()?Number(duration):null;
  if(minutes!==null&&(!Number.isInteger(minutes)||minutes<1||minutes>180)){
   setMessageOk(false);setMessage("Informe uma duração válida entre 1 e 180 minutos, ou deixe em branco.");return;
  }
  setSaving(true);setMessage("");
  try{
   const r=await fetch("/api/eixo/member/calendar",{
     method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({date:selected,didExercise:exercise,hadIntimacy:intimacy,
       durationMinutes:minutes,mood,consent:true})
   });
   const result=await r.json() as {ok?:boolean;message?:string};
   if(!r.ok||!result.ok)throw Error(result.message||"Não foi possível salvar.");
   const entry:CalendarEntry={date:selected,didExercise:exercise,hadIntimacy:intimacy,durationMinutes:minutes,mood};
   setEntries(previous=>[...previous.filter(x=>x.date!==selected),entry].sort((a,b)=>a.date.localeCompare(b.date)));
   setConsent(false);setMessageOk(true);setMessage("Seu registro privado foi salvo.");
  }catch(e){setMessageOk(false);setMessage(e instanceof Error?e.message:"Erro ao salvar.");}
  finally{setSaving(false);}
 }
 async function remove(all:boolean){
  if(saving)return;
  if(!window.confirm(all
    ?"Excluir permanentemente todos os registros do seu calendário EIXO? Esta ação não pode ser desfeita."
    :"Excluir o registro privado deste dia? Esta ação não pode ser desfeita."))return;
  setSaving(true);setMessage("");
  try{
   const r=await fetch("/api/eixo/member/calendar",{
    method:"DELETE",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify(all?{all:true,confirm:"EXCLUIR TODOS"}:{date:selected})
   });
   const d=await r.json() as {ok?:boolean;message?:string};
   if(!r.ok||!d.ok)throw Error(d.message||"Não foi possível excluir.");
   if(all)await reload();
   else setEntries(prev=>prev.filter(x=>x.date!==selected));
   setMessageOk(true);setMessage(all?"Seu histórico foi excluído.":"Registro excluído.");
  }catch(e){setMessageOk(false);setMessage(e instanceof Error?e.message:"Erro ao excluir.");}
  finally{setSaving(false);}
 }
 return <section className="eixo-calendar-page" aria-label="Calendário privado do Método EIXO">
  <div className="eixo-calendar-heading">
   <div><span className="eixo-calendar-eyebrow">✦ CALENDÁRIO EIXO · ÁREA PRIVADA</span>
    <h2>O seu mês. <em>Seu ritmo.</em></h2>
    <p>Acompanhe bem-estar, atividade física e intimidade, apenas se desejar. Sem rankings, metas de duração ou comparações.</p>
   </div>
   <div className="eixo-calendar-private-tag">♧ SOMENTE VOCÊ</div>
  </div>
  <div className="eixo-calendar-stat-grid">
   <div><small>DIAS REGISTRADOS</small><strong>{monthEntries}</strong><span>neste mês</span></div>
   <div><small>ATIVIDADE FÍSICA</small><strong>{activityDays}</strong><span>dias informados</span></div>
   <div><small>ENCONTROS ÍNTIMOS</small><strong>{intimacyDays}</strong><span>registros opcionais</span></div>
   <div><small>TRANQUILIDADE</small><strong>{calmDays}</strong><span>dias assim descritos</span></div>
  </div>
  <div className="eixo-calendar-main-grid">
   <section className="eixo-calendar-board" aria-label="Dias do mês">
    <div className="eixo-calendar-month-head">
      <div><span>SEU HISTÓRICO</span><h3>{monthLabel(month)}</h3></div>
      <div><button type="button" aria-label="Mês anterior" onClick={()=>navigate(-1)}>←</button><button type="button" aria-label="Próximo mês" disabled={!canNext} onClick={()=>navigate(1)}>→</button></div>
    </div>
    <div className="eixo-calendar-days" role="grid" aria-label={monthLabel(month)}>
     {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(w=><span className="eixo-calendar-weekday" key={w} role="columnheader">{w}</span>)}
     {Array.from({length:days.firstWeekday},(_,i)=><span key={"blank-"+i} className="eixo-calendar-blank"/>)}
     {Array.from({length:days.count},(_,i)=>{
       const date=month+"-"+String(i+1).padStart(2,"0");
       const entry=entries.find(e=>e.date===date);
       const disabled=date>today;
       return <button key={date} type="button" role="gridcell" disabled={disabled} aria-selected={selected===date}
         aria-label={String(i+1)+" de "+monthLabel(month)+(entry?", com registro":"")}
         className={["eixo-calendar-day",selected===date?"selected":"",entry?"has-entry":"",date===today?"today":""].join(" ")}
         onClick={()=>{setSelected(date);setMessage("");}}>
         <span>{i+1}</span><span className="eixo-calendar-day-markers" aria-hidden="true">
           {entry?.didExercise===true&&<i className="eixo-calendar-marker-move"/>}
           {entry?.hadIntimacy===true&&<i className="eixo-calendar-marker-intimacy"/>}
           {entry?.mood&&<i className="eixo-calendar-marker-mood"/>}
         </span>
       </button>;
     })}
    </div>
    <div className="eixo-calendar-legend"><span><i className="eixo-calendar-marker-move"/> Movimento</span><span><i className="eixo-calendar-marker-intimacy"/> Intimidade</span><span><i className="eixo-calendar-marker-mood"/> Bem-estar</span></div>
    {loading&&<p className="eixo-calendar-load" role="status">Carregando seus registros privados...</p>}
    {error&&<p className="eixo-calendar-error" role="alert">{error} <button onClick={()=>void reload()}>Tentar novamente</button></p>}
   </section>
   <section className="eixo-calendar-editor" aria-label="Registrar um dia">
    <span className="eixo-calendar-editor-eyebrow">{selectedEntry?"EDITAR REGISTRO":"NOVO REGISTRO"}</span>
    <h3>{dateLabel(selected)}</h3>
    <p className="eixo-calendar-editor-description">Você escolhe o que informar. Campos não selecionados não serão registrados.</p>
    <form onSubmit={save}>
     <ChoicePair value={exercise} onChange={setExercise} label="Fez atividade física?"/>
     <ChoicePair value={intimacy} onChange={v=>{setIntimacy(v);if(v!==true)setDuration("");}} label="Teve relação íntima? (opcional)"/>
     {intimacy===true&&<label className="eixo-calendar-minutes">Duração, se desejar informar
       <span><input type="number" inputMode="numeric" min={1} max={180} step={1} value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Ex.: 10"/><small>minutos</small></span>
     </label>}
     <fieldset className="eixo-calendar-moods"><legend>Como você se sentiu? (opcional)</legend><div>
       {moods.map(x=><button type="button" key={x.id} onClick={()=>setMood(mood===x.id?null:x.id)} aria-pressed={mood===x.id} className={mood===x.id?"active":""}><span>{x.icon}</span>{x.label}</button>)}
     </div></fieldset>
     <label className="eixo-calendar-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Autorizo salvar este registro privado, que pode conter informações sensíveis de minha vida íntima. Posso editá-lo ou excluí-lo quando quiser.</span></label>
     {message&&<p className={messageOk?"eixo-calendar-success":"eixo-calendar-error"} role="status">{message}</p>}
     <button type="submit" disabled={saving||loading} className="eixo-calendar-save">{saving?"SALVANDO...":selectedEntry?"SALVAR ALTERAÇÕES":"SALVAR REGISTRO PRIVADO"} <span>↗</span></button>
     {selectedEntry&&<button type="button" disabled={saving} onClick={()=>void remove(false)} className="eixo-calendar-delete">Excluir registro deste dia</button>}
    </form>
   </section>
  </div>
  <div className="eixo-calendar-insights">
   <span className="eixo-calendar-insight-icon">✦</span>
   <div><span>MENSAGEM CONTEXTUAL EIXO</span><p>{moodMessage}</p><small>Orientação automática baseada somente nos seus registros; não é avaliação médica nem análise clínica por IA.</small></div>
  </div>
  <div className="eixo-calendar-privacy-row">
   <p>◈ Apenas sua conta autorizada pode ler esses registros pela aplicação. Não usamos estes dados para publicidade ou para gerar diagnósticos. Como o MVP utiliza temporariamente o Supabase compartilhado, o isolamento em um projeto exclusivo é recomendado antes de ampliar o acesso a clientes.</p>
   <button disabled={saving||loading} type="button" onClick={()=>void remove(true)}>Excluir todo meu histórico</button>
  </div>
 </section>;
}
