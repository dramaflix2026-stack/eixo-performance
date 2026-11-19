"use client";
import {useMemo,useState} from "react";
import "./training.css";
type Level="iniciante"|"moderado";
type Movement={name:string;detail:string;minutes:number;kind:"mobilidade"|"forca"|"respiracao"};
const moves:Movement[]=[
 {name:"Respiração confortável",detail:"Sente-se com apoio. Inspire e expire naturalmente por alguns ciclos, sem prender o ar.",minutes:3,kind:"respiracao"},
 {name:"Mobilidade de ombros",detail:"Faça círculos lentos com os ombros, respeitando sua amplitude confortável.",minutes:2,kind:"mobilidade"},
 {name:"Caminhada leve",detail:"Caminhe em um ritmo no qual consiga conversar sem dificuldade.",minutes:5,kind:"mobilidade"},
 {name:"Sentar e levantar",detail:"Use uma cadeira firme. Levante e sente com controle, usando apoio se necessário.",minutes:3,kind:"forca"},
 {name:"Alongamento suave",detail:"Alongue braços e pernas sem forçar ou buscar dor.",minutes:2,kind:"mobilidade"},
 {name:"Pausa de atenção",detail:"Observe como está se sentindo e desacelere antes de encerrar.",minutes:2,kind:"respiracao"}
];
export function EixoTraining({dailyMinutes}:{dailyMinutes:number}){
 const [level,setLevel]=useState<Level>("iniciante");
 const [available,setAvailable]=useState(10);
 const [selected,setSelected]=useState<string[]>([]);
 const [finished,setFinished]=useState(false);
 const routine=useMemo(()=>{
  const pool=level==="iniciante"?moves:moves.filter(x=>x.name!=="Alongamento suave");
  const result:Movement[]=[];let used=0;
  for(const move of pool){if(used+move.minutes<=available){result.push(move);used+=move.minutes}}
  return result;
 },[level,available]);
 const total=routine.reduce((n,m)=>n+m.minutes,0);
 const checked=routine.filter(m=>selected.includes(m.name)).length;
 function reset(nextLevel?:Level,nextTime?:number){if(nextLevel)setLevel(nextLevel);if(nextTime)setAvailable(nextTime);setSelected([]);setFinished(false)}
 return <section className="eixo-training" aria-labelledby="eixo-training-title">
 <header><span>07 / MOVIMENTO E AUTOCUIDADO</span><h2 id="eixo-training-title">Movimente-se <em>no seu ritmo.</em></h2><p>Um planejador de movimentos leves para adultos, sem promessas de desempenho íntimo e sem comparação com outras pessoas.</p></header>
 <div className="eixo-training-config">
  <fieldset><legend>Como prefere começar?</legend><div className="eixo-training-options"><button type="button" aria-pressed={level==="iniciante"} className={level==="iniciante"?"active":""} onClick={()=>reset("iniciante")}>Iniciante</button><button type="button" aria-pressed={level==="moderado"} className={level==="moderado"?"active":""} onClick={()=>reset("moderado")}>Já me movimento</button></div></fieldset>
  <fieldset><legend>Tempo disponível</legend><div className="eixo-training-options">{[5,10,15,20].map(n=><button type="button" key={n} aria-pressed={available===n} className={available===n?"active":""} onClick={()=>reset(undefined,n)}>{n} min</button>)}</div></fieldset>
 </div>
 <div className="eixo-training-summary"><div><span>SEU PLANO DE HOJE</span><strong>{total} min previstos</strong><p>{routine.length} movimentos selecionados · preferência de cadastro: {dailyMinutes} min/dia</p></div><div><strong>{checked}/{routine.length}</strong><span>ATIVIDADES MARCADAS</span></div></div>
 <div className="eixo-training-steps">{routine.map((m,i)=><label key={m.name} className={"eixo-training-step"+(selected.includes(m.name)?" checked":"")}><input type="checkbox" checked={selected.includes(m.name)} onChange={e=>{setFinished(false);setSelected(old=>e.target.checked?[...old,m.name]:old.filter(x=>x!==m.name))}}/><span className="eixo-training-number">{String(i+1).padStart(2,"0")}</span><span className="eixo-training-copy"><small>{m.kind.toUpperCase()} · {m.minutes} MIN</small><strong>{m.name}</strong><span>{m.detail}</span></span></label>)}</div>
 <div className="eixo-training-actions"><button type="button" disabled={checked===0} onClick={()=>setFinished(true)}>ENCERRAR MINHA SESSÃO ↗</button><button type="button" onClick={()=>reset()}>RECOMEÇAR</button></div>
 {finished&&<p className="eixo-training-feedback" role="status">Sessão encerrada. Você marcou {checked} atividade(s). Essa confirmação é apenas local e não foi salva no histórico da sua conta.</p>}
 <aside className="eixo-training-safety"><strong>Segurança em primeiro lugar.</strong> Pare se sentir dor, tontura, falta de ar incomum ou desconforto. Se tiver condições médicas, limitações ou estiver retornando à atividade após longo período, procure orientação profissional antes de iniciar. Não existe meta obrigatória de execução.</aside>
 </section>;
}
