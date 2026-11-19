"use client";
import {useState} from "react";
import "./content-experience.css";
type Props={kind:"lesson"|"bonus";title:string;subtitle:string;index:number;total:number;minutesLabel:string;prompts?:string[]};
const lessonPrompts=[
["Qual pensamento de cobrança você gostaria de reconhecer?","Que resposta mais gentil poderia oferecer a si mesmo?"],
["O que você percebe quando desacelera por alguns instantes?","Qual pausa realista cabe no seu dia?"],
["Que preocupação está tentando antecipar?","Qual parte dessa preocupação é um fato observável?"],
["O que você gostaria de comunicar com mais tranquilidade?","Qual pergunta aberta poderia iniciar essa conversa?"],
["O que ajuda você a voltar ao momento presente?","Que atitude de presença gostaria de praticar?"],
["Que hábito da sua rotina merece mais atenção?","Qual pequeno ajuste seria possível nesta semana?"],
["O que você aprendeu sobre si durante a jornada?","Qual próximo passo deseja manter, sem cobrança?"]
];
export function EixoContentExperience({kind,title,subtitle,index,total,minutesLabel,prompts}:Props){
 const [answer,setAnswer]=useState("");
 const [reflection,setReflection]=useState("");
 const [showPractice,setShowPractice]=useState(false);
 const questions=prompts||lessonPrompts[index-1]||lessonPrompts[0];
 return <div className="eixo-content-experience">
 <div className="eixo-content-hero"><div className="eixo-content-hero-top"><span>MÉTODO EIXO / {kind==="lesson"?"JORNADA INICIAL":"MATERIAL EXCLUSIVO"}</span><span>{String(index).padStart(2,"0")} / {String(total).padStart(2,"0")}</span></div><div className="eixo-content-hero-bottom"><span>EXPERIÊNCIA GUIADA · {minutesLabel}</span><h3>{title}</h3><p>{subtitle}</p></div></div>
 <div className="eixo-content-available"><span className="eixo-content-available-icon">▤</span><div><strong>Seu conteúdo educativo está disponível abaixo</strong><p>Leia as orientações e siga as atividades no seu ritmo. Você não precisa esperar por vídeos para começar.</p></div></div>
 <div className="eixo-content-media-roadmap"><div><span>▶</span><strong>Vídeo da experiência</strong><small>Espaço reservado · mídia ainda não cadastrada</small></div><div><span>♫</span><strong>Versão em áudio</strong><small>Espaço reservado · mídia ainda não cadastrada</small></div></div>
 {kind==="lesson"&&<section className="eixo-content-practice"><div className="eixo-content-practice-heading"><div><span>ATIVIDADE REFLEXIVA</span><h4>Coloque em prática.</h4><p>Uma pausa para transformar a leitura em uma reflexão pessoal.</p></div><button type="button" onClick={()=>setShowPractice(v=>!v)} aria-expanded={showPractice}>{showPractice?"FECHAR":"COMEÇAR"} ↗</button></div>{showPractice&&<div className="eixo-content-practice-form"><label>{questions[0]}<textarea maxLength={600} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Escreva para refletir..."/></label><label>{questions[1]}<textarea maxLength={600} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Sua resposta..."/></label><p>Suas respostas ficam apenas nesta tela e não são salvas na conta. Evite inserir informações que queira preservar.</p><button type="button" onClick={()=>{setAnswer("");setReflection("")}}>LIMPAR RESPOSTAS</button></div>}</section>}
 </div>;
}
