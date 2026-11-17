"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import "./quiz.css";

type Question = { prompt: string; options: string[]; eyebrow?: string };
type Step = { kind: "question"; number: number } | { kind: "story"; number: number } | { kind: "prep" } | { kind: "scratch" } | { kind: "result" };
type StageImage = { src: string; alt: string };

const QUESTIONS: Question[] = [
  {prompt:"Vamos começar. Qual é sua faixa de idade?",options:["18 a 24 anos","25 a 34 anos","35 a 44 anos","45 anos ou mais","Prefiro não informar"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"Em qual momento a pressão costuma aparecer?",options:["Antes da intimidade","Durante o momento íntimo","Depois, ao pensar no que aconteceu","Em vários momentos","Não sinto essa pressão"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"Com que frequência o medo de falhar ocupa seus pensamentos?",options:["Nunca","Raramente","Às vezes","Frequentemente"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"Qual dessas preocupações mais se aproxima da sua experiência?",options:["Receio de não corresponder às expectativas","Preocupação com o tempo da relação","Medo de perder a ereção","Dificuldade de estar presente","Outra preocupação ou nenhuma"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"Quando pensa na próxima experiência íntima, o que mais gostaria de sentir?",options:["Mais confiança","Menos ansiedade","Mais conexão","Mais tranquilidade","Já me sinto bem"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"A ansiedade já veio acompanhada de tensão, respiração acelerada ou pensamentos repetitivos?",options:["Não percebo isso","Raramente","Algumas vezes","Com frequência"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"Uma experiência anterior desagradável aumenta sua preocupação nas próximas ocasiões?",options:["Nunca","Raramente","Às vezes","Frequentemente"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"Você já evitou uma situação íntima por receio de não corresponder?",options:["Nunca","Uma vez ou outra","Algumas vezes","Muitas vezes"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"Como você costuma conversar sobre essas preocupações?",options:["Converso abertamente","Converso com alguma dificuldade","Quase nunca falo sobre isso","Não tenho com quem conversar"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"O estresse do trabalho ou da rotina influencia a sua confiança íntima?",options:["Não percebo relação","Um pouco","Moderadamente","Bastante"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Como tem sido seu sono nas últimas semanas?",options:["Tenho dormido bem","Oscila bastante","Durmo menos do que gostaria","Tenho muitas noites ruins"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Você já buscou alguma estratégia para lidar com essa pressão?",options:["Ainda não tentei","Já tentei respirar ou relaxar","Já conversei com alguém","Já procurei orientação profissional","Tentei outras alternativas"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Qual é sua situação afetiva atualmente?",options:["Em um relacionamento","Conhecendo alguém","Solteiro","Prefiro não informar"],eyebrow:"05 · CONEXÃO"},
  {prompt:"Antes da intimidade, quanto espaço a autocobrança ocupa na sua atenção?",options:["Quase nenhum","Um pouco","Bastante","É difícil pensar em outra coisa"],eyebrow:"05 · CONEXÃO"},
  {prompt:"O que costuma ajudar você a ficar mais à vontade?",options:["Conversar e sentir confiança","Respirar e desacelerar","Ter mais tempo e tranquilidade","Ainda não descobri","Não costumo sentir dificuldade"],eyebrow:"05 · CONEXÃO"},
  {prompt:"Quanto tempo por dia você conseguiria dedicar a estratégias de bem-estar?",options:["Até 5 minutos","5 a 10 minutos","10 a 15 minutos","Mais de 15 minutos","Ainda não sei"],eyebrow:"06 · PRÓXIMOS PASSOS"},
  {prompt:"Qual mudança faria mais diferença para você neste momento?",options:["Reduzir o medo de falhar","Ficar mais presente na intimidade","Comunicar melhor minhas inseguranças","Lidar melhor com o estresse da rotina","Entender melhor o que estou sentindo"],eyebrow:"06 · PRÓXIMOS PASSOS"},
  {prompt:"Você gostaria de receber um roteiro educativo inicial baseado nas suas respostas?",options:["Sim, quero começar","Quero conhecer primeiro","Talvez, ainda estou pensando","Prefiro apenas ver minha reflexão"],eyebrow:"06 · PRÓXIMOS PASSOS"}
];

const STORIES = [
  {badge:"01 / ENTENDER A PRESSÃO",heading:"A ANSIEDADE PODE ENTRAR EM CENA ANTES MESMO DA INTIMIDADE.",body:"Quando a mente antecipa o pior cenário, o corpo pode responder com tensão. Reconhecer esse movimento é um primeiro passo — não uma sentença sobre você.",photo:"/images/pressao.jpg",alt:"Retrato masculino em reflexão",visual:"breath",button:"ENTENDI, CONTINUAR",tag:"PRESSÃO NÃO DEFINE QUEM VOCÊ É."},
  {badge:"02 / CORPO E MENTE",heading:"SEU CORPO E SUA ATENÇÃO NÃO PRECISAM ESTAR EM GUERRA.",body:"O estresse pode influenciar a maneira como você percebe cada momento. Desacelerar, respirar e observar os próprios pensamentos são práticas de atenção, não promessas de resultado.",photo:"/images/clareza.jpg",alt:"Retrato masculino sereno",visual:"wave",button:"CONTINUAR MINHA REFLEXÃO",tag:"MAIS PRESENÇA, MENOS AUTOCONTROLE FORÇADO."},
  {badge:"03 / UMA NOVA PERSPECTIVA",heading:"DO MEDO DE FALHAR PARA A POSSIBILIDADE DE ESTAR PRESENTE.",body:"Não existe uma medida única de desempenho. Uma experiência íntima envolve conexão, comunicação, contexto e bem-estar — não apenas uma meta de tempo.",photo:"/images/partida.jpg",alt:"Retrato masculino confiante",visual:"split",button:"QUERO AVANÇAR",tag:"O SEU RITMO IMPORTA."},
  {badge:"04 / ROTINA E CONFIANÇA",heading:"NÃO É SÓ SOBRE AQUELE MOMENTO. A ROTINA TAMBÉM CONTA.",body:"Sono, preocupações, expectativas e disposição podem fazer parte da experiência. Por isso, olhar para o cotidiano pode ser tão importante quanto olhar para a intimidade.",photo:"/images/hero.jpg",alt:"Retrato masculino editorial",visual:"meter",button:"SEGUIR COM O QUESTIONÁRIO",tag:"SEM FÓRMULA MÁGICA. COM MAIS CLAREZA."},
  {badge:"05 / O QUE VEM A SEGUIR",heading:"VOCÊ JÁ IDENTIFICOU PADRÕES. AGORA VAMOS ORGANIZAR O PRÓXIMO PASSO.",body:"O EIXO reúne reflexões e práticas educativas de atenção, diálogo e organização da rotina. Você decidirá o que faz sentido experimentar e quando procurar apoio especializado.",photo:"/images/clareza.jpg",alt:"Retrato editorial de um homem",visual:"steps",button:"QUERO CONCLUIR",tag:"UM PASSO DE CADA VEZ."}
] as const;

const FLOW:Step[] = [];
QUESTIONS.forEach((_,number)=>{
  FLOW.push({kind:"question",number});
  if((number+1)%3===0 && number<15) FLOW.push({kind:"story",number:Math.floor(number/3)});
});
FLOW.push({kind:"prep"},{kind:"scratch"},{kind:"result"});

const FINISH_INDEX=FLOW.length-1;
const ageOptions=QUESTIONS[0].options;

function StoryAnimation({variant}:{variant:string}){
  if(variant==="breath") return <div className="funnel-breath" aria-hidden="true"><i/><i/><i/><span>RESPIRE · OBSERVE</span></div>;
  if(variant==="wave") return <div className="funnel-wave" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{animationDelay:(i*.085)+"s"}}/>)}<span>ATENÇÃO AO MOMENTO</span></div>;
  if(variant==="split") return <div className="funnel-compare" aria-hidden="true"><span>PRESSÃO</span><b>→</b><span>PRESENÇA</span></div>;
  if(variant==="meter") return <div className="funnel-meter" aria-hidden="true"><i/><i/><i/><i/><strong>ROTINA • EMOÇÕES • CONTEXTO</strong></div>;
  return <div className="funnel-steps-visual" aria-hidden="true"><span>01 NOTAR</span><span>02 RESPIRAR</span><span>03 CONVERSAR</span></div>;
}

function ScratchCard({onReveal}:{onReveal:()=>void}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const dragging=useRef(false);
  const last=useRef<{x:number;y:number}|null>(null);
  const revealed=useRef(false);
  const [isRevealed,setIsRevealed]=useState(false);

  const finish=()=>{
    if(revealed.current)return;
    revealed.current=true;
    setIsRevealed(true);
    onReveal();
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    if(!ctx)return;
    const rect=canvas.getBoundingClientRect();
    const width=Math.max(1,rect.width);
    const height=Math.max(1,rect.height);
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const gradient=ctx.createLinearGradient(0,0,width,height);
    gradient.addColorStop(0,"#eac776");
    gradient.addColorStop(.5,"#bb903f");
    gradient.addColorStop(1,"#f9d98d");
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,width,height);
    for(let n=0;n<130;n++){
      const x=(n*171.73)%width,y=(n*83.31)%height;
      ctx.fillStyle=n%2?"rgba(255,255,255,.18)":"rgba(78,52,20,.13)";
      ctx.beginPath();ctx.arc(x,y,n%4?0.8:1.4,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle="#271b0b";
    ctx.textAlign="center";
    ctx.font="900 "+Math.min(34,Math.max(22,width*.072))+"px Arial";
    ctx.fillText("RASPE AQUI",width/2,height/2-8);
    ctx.font="700 12px Arial";
    ctx.fillText("DESLIZE O DEDO PARA REVELAR",width/2,height/2+26);
    ctx.textAlign="start";
  },[]);

  const draw=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!dragging.current || revealed.current)return;
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!canvas||!ctx)return;
    const bounds=canvas.getBoundingClientRect();
    const pos={x:event.clientX-bounds.left,y:event.clientY-bounds.top};
    ctx.save();
    ctx.globalCompositeOperation="destination-out";
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.lineWidth=48;
    ctx.beginPath();
    if(last.current)ctx.moveTo(last.current.x,last.current.y);
    else ctx.moveTo(pos.x,pos.y);
    ctx.lineTo(pos.x,pos.y);
    ctx.stroke();
    ctx.beginPath();ctx.arc(pos.x,pos.y,24,0,Math.PI*2);ctx.fill();
    ctx.restore();
    last.current=pos;
  };

  const inspect=()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!canvas||!ctx||revealed.current)return;
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let removed=0,count=0;
    for(let p=3;p<pixels.length;p+=4*24){count++;if(pixels[p]<100)removed++;}
    if(count&&removed/count>=.32)finish();
  };

  return <div className="funnel-scratch">
    <div className="funnel-scratch-card">
      <div className="funnel-scratch-prize">
        <span>✦ PRESENTE EIXO LIBERADO</span>
        <strong>SEU ROTEIRO INICIAL DE 7 DIAS</strong>
        <small>Um guia educativo de atenção, presença e comunicação.</small>
      </div>
      <canvas
        ref={canvasRef}
        className={"funnel-scratch-canvas"+(isRevealed?" is-open":"")}
        aria-label="Cartão dourado interativo para raspar e revelar um guia educativo"
        onPointerDown={e=>{
          if(revealed.current)return;
          dragging.current=true;
          last.current=null;
          e.currentTarget.setPointerCapture(e.pointerId);
          draw(e);
        }}
        onPointerMove={draw}
        onPointerUp={e=>{if(!dragging.current)return;draw(e);dragging.current=false;last.current=null;inspect()}}
        onPointerCancel={()=>{dragging.current=false;last.current=null;inspect()}}
        onLostPointerCapture={()=>{dragging.current=false;last.current=null}}
      />
    </div>
    {isRevealed?<p className="funnel-scratch-caption">✦ Seu bônus está liberado.</p>:
      <button type="button" className="funnel-scratch-alt" onClick={finish}>Não consegue raspar? Revelar por toque</button>}
  </div>;
}

const DAYS=[
  ["DIA 01","IDENTIFICAR","Anote quando a autocobrança aparece e o que você pensa nesse momento."],
  ["DIA 02","DESACELERAR","Reserve alguns minutos para perceber sua respiração e relaxar os ombros, sem exigir um resultado."],
  ["DIA 03","REVER EXPECTATIVAS","Reflita sobre a diferença entre conexão e cobrança por desempenho."],
  ["DIA 04","CONVERSAR","Quando possível, pratique uma conversa aberta sobre expectativas, limites e conforto."],
  ["DIA 05","PRESENÇA","Em uma atividade cotidiana, experimente prestar atenção às sensações do momento, sem se avaliar."],
  ["DIA 06","ROTINA","Observe como sono, cansaço e estresse podem influenciar sua disposição."],
  ["DIA 07","REVISAR","Retome suas anotações e identifique quais estratégias fazem sentido continuar. Se houver sofrimento persistente, considere buscar apoio profissional."]
];

function PersonalizedResult({answers,name}:{answers:(number|null)[];name:string}){
  const focus=QUESTIONS[16].options[answers[16]??4];
  const concern=QUESTIONS[3].options[answers[3]??4];
  const time=QUESTIONS[15].options[answers[15]??4];
  const greeting=name.trim()?name.trim().slice(0,40)+",":"";
  const insights=[
    {show:(answers[2]??0)>=2,text:"Você indicou que o medo de falhar aparece com alguma frequência."},
    {show:(answers[5]??0)>=2,text:"Você percebeu reações de tensão ou pensamentos repetitivos em alguns momentos."},
    {show:(answers[6]??0)>=2,text:"Experiências anteriores parecem influenciar suas expectativas atuais."},
    {show:(answers[7]??0)>=2,text:"Você relatou ter evitado situações íntimas por preocupação com o desempenho."},
    {show:(answers[8]??0)>=2,text:"Conversar sobre essas preocupações pode ser especialmente importante para você."},
    {show:(answers[9]??0)>=2,text:"O estresse da rotina apareceu como um fator relevante nas suas respostas."},
    {show:(answers[10]??0)>=2,text:"Seu sono pode ser uma dimensão da rotina que merece atenção."},
    {show:(answers[13]??0)>=2,text:"A autocobrança parece ocupar bastante espaço antes da intimidade."}
  ].filter(item=>item.show).map(item=>item.text).slice(0,3);
  const observations=insights.length?insights:[
    "Você identificou suas próprias prioridades para lidar com a intimidade com menos cobrança.",
    "Perceber o que ajuda você a se sentir confortável já é um ponto de partida."
  ];
  const situation=QUESTIONS[1].options[answers[1]??4].toLowerCase();
  const adjustedDays=DAYS.map(([day,title,copy],index)=>{
    if(index===0)return [day,title,"Observe como você se sente especialmente "+situation+". Registre pensamentos e situações, sem se julgar."];
    if(index===3 && (answers[8]??0)>=2)return [day,title,"Se houver segurança e abertura, pratique uma conversa pequena e honesta sobre suas preocupações. Você não precisa explicar tudo de uma vez."];
    if(index===5 && (answers[10]??0)>=2)return [day,title,"Observe seu padrão de sono e cansaço e o impacto que a rotina tem na sua disposição. Não busque perfeição."];
    return [day,title,copy];
  });
  return <div className="funnel-result">
    <span className="funnel-tag">SEU RESULTADO · EIXO</span>
    <h1>{greeting&&<span className="funnel-result-name">{greeting} </span>}SEU PONTO DE PARTIDA ESTÁ <em>PRONTO.</em></h1>
    <p className="funnel-result-intro">Você concluiu 18 perguntas e desbloqueou um roteiro educativo para começar com mais consciência e menos cobrança.</p>
    <div className="funnel-summary">
      <span className="funnel-small-label">SUA REFLEXÃO PESSOAL</span>
      <h2>{focus}</h2>
      <p>Você destacou como preocupação: <strong>{concern.toLowerCase()}</strong>. Disponibilidade informada para práticas educativas: <strong>{time.toLowerCase()}</strong>.</p>
      <div className="funnel-insights"><span>O QUE SUAS RESPOSTAS DESTACARAM</span>{observations.map((note,index)=><p key={index}><b>✓</b>{note}</p>)}</div>
      <p className="funnel-profile-note">Essas observações são descritivas e não constituem avaliação clínica, diagnóstico ou previsão de resultados.</p>
    </div>
    <div className="funnel-plan-heading"><span className="funnel-tag">BÔNUS LIBERADO NA RASPADINHA</span><h2>SEU ROTEIRO INICIAL DE <em>7 DIAS</em></h2><p>São sugestões educativas ajustadas a alguns pontos da sua reflexão, não uma prescrição clínica ou promessa de desempenho.</p></div>
    <div className="funnel-days">{adjustedDays.map(([day,title,copy])=><details key={day}><summary><span>{day}</span><strong>{title}</strong><b>+</b></summary><p>{copy}</p></details>)}</div>
    <p className="funnel-medical">A ansiedade de desempenho e dificuldades sexuais podem envolver múltiplos fatores. Se a situação incomoda, persiste ou surge de repente, procure atendimento médico ou psicológico apropriado.</p>
  </div>;
}

export default function Quiz(){
  const [position,setPosition]=useState(0);
  const [answers,setAnswers]=useState<(number|null)[]>(Array(QUESTIONS.length).fill(null));
  const [name,setName]=useState("");
  const [revealed,setRevealed]=useState(false);
  const [restartKey,setRestartKey]=useState(0);
  useEffect(()=>{window.scrollTo({top:0,behavior:"auto"});},[position]);
  const step=FLOW[position];
  const answered=answers.filter(a=>a!==null).length;
  const progress=Math.round(100*answered/QUESTIONS.length);
  const isResult=step.kind==="result";
  const questionNumber=step.kind==="question"?step.number:0;
  const showProgress=step.kind!=="result";
  const select=(value:number)=>{
    setAnswers(old=>{const next=[...old];next[questionNumber]=value;return next;});
    setPosition(old=>Math.min(FINISH_INDEX,old+1));
  };
  const goBack=()=>setPosition(old=>Math.max(0,old-1));
  const reset=()=>{
    setPosition(0);setAnswers(Array(QUESTIONS.length).fill(null));
    setName("");setRevealed(false);setRestartKey(old=>old+1);
  };
  const currentLabel=step.kind==="question"?"PERGUNTA "+(step.number+1)+" DE "+QUESTIONS.length:
    step.kind==="story"?"MOMENTO EIXO · "+(step.number+1):
    step.kind==="prep"?"SEU ROTEIRO":"RASPADINHA EIXO";
  const profileAge=ageOptions[answers[0]??4];

  return <main className="funnel-page">
    <header className="funnel-header"><div className="funnel-header-inner">
      <Link href="/" className="funnel-brand" aria-label="EIXO, página inicial"><span>◈</span>EIXO</Link>
      <div className="funnel-private">◉ &nbsp; CONTEÚDO DISCRETO E EDUCATIVO</div>
    </div></header>
    <div className="funnel-content">
      {showProgress&&<div className="funnel-progress">
        <div className="funnel-progress-line"><span>{currentLabel}</span><span>{progress}% CONCLUÍDO</span></div>
        <div className="funnel-progress-segments">{Array.from({length:6},(_,i)=><i key={i} style={{background:answered>=((i+1)*3)?"#d9a95f":"#35302a"}}/>)}</div>
      </div>}

      {step.kind==="question"&&<section className="funnel-question" key={"q"+questionNumber}>
        <span className="funnel-tag">{QUESTIONS[questionNumber].eyebrow}</span>
        <h1>{QUESTIONS[questionNumber].prompt}</h1>
        <p>Responda com sinceridade. Não existem respostas certas ou erradas.</p>
        <div className="funnel-options">
          {QUESTIONS[questionNumber].options.map((label,index)=><button
            key={label}
            type="button"
            className={"funnel-option"+(answers[questionNumber]===index?" is-selected":"")}
            onClick={()=>select(index)}>
              <span className="funnel-radio"/><span>{label}</span><b>↗</b>
          </button>)}
        </div>
      </section>}

      {step.kind==="story"&&<section className="funnel-story" key={"story"+step.number}>
        <span className="funnel-tag">{STORIES[step.number].badge}</span>
        <h1>{STORIES[step.number].heading}</h1>
        <div className="funnel-story-media">
          <img src={STORIES[step.number].photo} alt={STORIES[step.number].alt} />
          <div className="funnel-story-overlay"><StoryAnimation variant={STORIES[step.number].visual}/></div>
          <span className="funnel-story-media-tag">EIXO / PERFORMANCE MENTAL</span>
        </div>
        <p>{STORIES[step.number].body}</p>
        <div className="funnel-story-foot">{STORIES[step.number].tag}</div>
        <button className="funnel-main-cta" type="button" onClick={()=>setPosition(pos=>pos+1)}>{STORIES[step.number].button} <span>↗</span></button>
      </section>}

      {step.kind==="prep"&&<section className="funnel-prep">
        <span className="funnel-tag">18 / 18 PERGUNTAS RESPONDIDAS</span>
        <div className="funnel-icon">◈</div>
        <h1>SEU PONTO DE PARTIDA ESTÁ <em>PRONTO.</em></h1>
        <p>Organizamos uma reflexão a partir das suas respostas. Para liberar seu roteiro inicial, falta apenas uma etapa.</p>
        <div className="funnel-private-panel"><span>◈ PRIVACIDADE EM PRIMEIRO LUGAR</span>
          <p>Sem cadastro, sem envio das respostas para um servidor. Você pode informar um nome para personalizar a tela final, se quiser.</p>
          <label htmlFor="eixo-display-name">COMO PODEMOS TE CHAMAR? <small>(OPCIONAL)</small></label>
          <input id="eixo-display-name" value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="Seu primeiro nome"/>
        </div>
        <div className="funnel-offer-perks"><span>✓ 18 respostas consideradas</span><span>✓ Roteiro inicial de 7 dias</span><span>✓ Experiência discreta</span></div>
        <button type="button" className="funnel-main-cta" onClick={()=>setPosition(pos=>pos+1)}>LIBERAR MINHA RASPADINHA <span>↗</span></button>
      </section>}

      {step.kind==="scratch"&&<section className="funnel-scratch-step">
        <span className="funnel-tag">ETAPA FINAL · BENEFÍCIO EIXO</span>
        <h1>{name.trim()?name.trim().slice(0,40)+", ":""}VOCÊ DESBLOQUEOU UMA <em>RASPADINHA!</em></h1>
        <p>Raspe o cartão dourado para revelar o bônus educativo que preparamos para esta experiência.</p>
        <ScratchCard key={restartKey} onReveal={()=>setRevealed(true)}/>
        {revealed&&<button type="button" className="funnel-main-cta funnel-scratch-next" onClick={()=>setPosition(FINISH_INDEX)}>ACESSAR MEU ROTEIRO <span>↗</span></button>}
        <small>O bônus é gratuito e igual para todos. Não há sorteio nem desconto anunciado.</small>
      </section>}

      {step.kind==="result"&&<section className="funnel-result-screen">
        <PersonalizedResult answers={answers} name={name}/>
        <div className="funnel-result-actions"><Link className="funnel-main-cta" href="/">CONHECER O EIXO <span>↗</span></Link><button type="button" onClick={reset}>REFAZER QUESTIONÁRIO</button></div>
      </section>}

      {position>0&&step.kind!=="result"&&<button type="button" onClick={goBack} className="funnel-back">← VOLTAR</button>}
    </div>
    <footer className="funnel-footer"><span>© EIXO · CONFIANÇA COMEÇA NA MENTE</span><span>Conteúdo educativo. As respostas permanecem apenas nesta página.</span></footer>
  </main>;
}
