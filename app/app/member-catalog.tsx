"use client";

import {useRef} from "react";
import "./catalog.css";

type Lesson={day:number;phase:string;title:string;estimatedMinutes:number;intro:string};
type Bonus={id:number;title:string;subtitle:string;duration:string};
type CatalogProps={
 firstName:string;goal:string;completedDays:number[];
 lessons:Lesson[];bonuses:Bonus[];
 onOpenLesson:(day:number)=>void;onOpenBonus:(id:number)=>void;
};
type Cover={image:string;filter:string;position:string;theme:string;label:string};
const lessonCovers:Cover[]=[
 {image:"/images/pressao.jpg",filter:"brightness(.74) saturate(.7)",position:"center",theme:"gold",label:"MENTE E CONFIANÇA"},
 {image:"/images/clareza.jpg",filter:"brightness(.72) saturate(.74)",position:"45% center",theme:"navy",label:"RESPIRAÇÃO E CALMA"},
 {image:"/images/hero.jpg",filter:"brightness(.68) saturate(.66)",position:"55% center",theme:"copper",label:"NOVAS PERSPECTIVAS"},
 {image:"/images/partida.jpg",filter:"brightness(.75) saturate(.7)",position:"center",theme:"wine",label:"CONEXÃO"},
 {image:"/images/clareza.jpg",filter:"brightness(.67) saturate(.9)",position:"70% center",theme:"forest",label:"PRESENÇA"},
 {image:"/images/hero.jpg",filter:"brightness(.65) saturate(.55)",position:"30% center",theme:"navy",label:"ROTINA"},
 {image:"/images/pressao.jpg",filter:"brightness(.73) saturate(.65)",position:"70% center",theme:"gold",label:"REVISÃO"}
];
const bonusCovers:Cover[]=[
 {image:"/images/partida.jpg",filter:"brightness(.7) saturate(.68)",position:"center",theme:"copper",label:"GUIA PRÁTICO"},
 {image:"/images/pressao.jpg",filter:"brightness(.62) saturate(.72)",position:"center",theme:"navy",label:"SEM MEDO"},
 {image:"/images/clareza.jpg",filter:"brightness(.64) saturate(.76)",position:"center",theme:"wine",label:"CONVERSAS"},
 {image:"/images/hero.jpg",filter:"brightness(.6) saturate(.75)",position:"center",theme:"forest",label:"HORA H"},
 {image:"/images/partida.jpg",filter:"brightness(.68) saturate(.59)",position:"70% center",theme:"gold",label:"CORPO E MENTE"}
];
function Rail({title,eyebrow,description,children}:{title:string;eyebrow:string;description:string;children:React.ReactNode}){
 const rail=useRef<HTMLDivElement>(null);
 return <section className="eixo-catalog-rail" aria-label={title}>
   <div className="eixo-catalog-rail-head"><div><span>{eyebrow}</span><h3>{title}</h3><p>{description}</p></div>
     <div className="eixo-catalog-rail-actions"><button aria-label={"Voltar em "+title} onClick={()=>rail.current?.scrollBy({left:-560,behavior:"smooth"})}>←</button><button aria-label={"Avançar em "+title} onClick={()=>rail.current?.scrollBy({left:560,behavior:"smooth"})}>→</button></div>
   </div>
   <div className="eixo-catalog-track" ref={rail}>{children}</div>
 </section>;
}
function Poster({cover,kicker,title,number,caption,completed,onClick}:{cover:Cover;kicker:string;title:string;number:string;caption:string;completed?:boolean;onClick:()=>void}){
 return <button type="button" onClick={onClick} className={"eixo-catalog-poster eixo-poster-"+cover.theme} aria-label={"Abrir "+title}>
   <div className="eixo-catalog-poster-media" style={{backgroundImage:`linear-gradient(0deg, #08090a 2%, rgba(8,9,10,.3) 65%, rgba(8,9,10,.2)),url("${cover.image}")`,backgroundPosition:cover.position,filter:cover.filter}} aria-hidden="true"/>
   <div className="eixo-catalog-poster-top"><span>EI<span>X</span>O.</span><span>{number}</span></div>
   <div className="eixo-catalog-poster-bottom"><span className="eixo-catalog-poster-symbol">✧</span><span className="eixo-catalog-poster-category">{cover.label}</span><strong>{title}</strong><span className="eixo-catalog-poster-duration">{kicker}</span></div>
   {completed&&<span className="eixo-catalog-completed">✓ CONCLUÍDO</span>}
   <div className="eixo-catalog-poster-caption"><strong>{caption}</strong><span>ABRIR ↗</span></div>
 </button>;
}
export function MemberCatalog({firstName,goal,completedDays,lessons,bonuses,onOpenLesson,onOpenBonus}:CatalogProps){
 const current=lessons.find(l=>!completedDays.includes(l.day))||lessons[6]||lessons[0];
 const goalLabel:{[key:string]:string}={confianca:"confiança",presenca:"presença",dialogo:"conexão",rotina:"bem-estar"};
 return <section className="eixo-catalog" aria-label="Catálogo de conteúdos do Método EIXO">
  <div className="eixo-catalog-featured">
   <div className="eixo-catalog-featured-photo" aria-hidden="true"/>
   <div className="eixo-catalog-featured-copy">
    <span className="eixo-catalog-kicker">✦ SEU PRÓXIMO PASSO · DIA {String(current.day).padStart(2,"0")}</span>
    <h2>{firstName},<br/>o ritmo <em>é seu.</em></h2>
    <p>Seu foco é {goalLabel[goal]||"cuidar de você"}. Comece pela atividade de hoje e explore os materiais no seu tempo, sem cobrança.</p>
    <div className="eixo-catalog-featured-meta"><span>◷ {current.estimatedMinutes} MIN</span><span>◈ DIA {current.day} DE 7</span></div>
    <button onClick={()=>onOpenLesson(current.day)} className="eixo-catalog-featured-cta">▶ CONTINUAR MINHA JORNADA <span>↗</span></button>
   </div>
   <div className="eixo-catalog-featured-count"><strong>{String(completedDays.length).padStart(2,"0")}/07</strong><span>DIAS CONCLUÍDOS</span></div>
  </div>

  <Rail title="Sua jornada, um dia por vez" eyebrow="01 / CONTINUE ASSISTINDO E EXPLORANDO" description="Sete etapas com atividades práticas e reflexões.">
   {lessons.map((l,i)=><Poster key={l.day} cover={lessonCovers[i]||lessonCovers[0]} kicker={"DIA "+String(l.day).padStart(2,"0")+" · "+l.estimatedMinutes+" MIN"} title={l.title} number={String(l.day).padStart(2,"0")+"/07"} caption={l.phase} completed={completedDays.includes(l.day)} onClick={()=>onOpenLesson(l.day)}/>)}
  </Rail>
  <Rail title="Materiais exclusivos" eyebrow="02 / BIBLIOTECA EIXO" description="Guias e exercícios complementares já disponíveis para você.">
   {bonuses.map((b,i)=><Poster key={b.id} cover={bonusCovers[i]||bonusCovers[0]} kicker={b.duration} title={b.title} number={String(b.id).padStart(2,"0")+"/05"} caption={"BÔNUS "+b.id} onClick={()=>onOpenBonus(b.id)}/>)}
  </Rail>

  <div className="eixo-catalog-media-note"><span className="eixo-catalog-media-note-icon">◉</span><div><strong>Biblioteca preparada para vídeo e áudio.</strong><p>As capas atualmente abrem as atividades e guias já existentes. Os players de vídeo/áudio serão vinculados a conteúdos próprios ou autorizados, sem apresentar aulas fictícias como se estivessem disponíveis.</p></div></div>
 </section>;
}
