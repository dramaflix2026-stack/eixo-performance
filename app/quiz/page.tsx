"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import "./quiz.css";

type Response = number | null;
type QuizQuestion = { title: string; options: string[] };

const QUESTIONS: QuizQuestion[] = [
  { title: "Antes de um momento íntimo, com que frequência você se preocupa com seu desempenho?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Você sente que precisa corresponder a expectativas ou provar alguma coisa?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Durante a intimidade, sua atenção fica mais no desempenho do que no momento?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Uma experiência desagradável anterior aumenta sua preocupação com as próximas?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "O estresse do dia a dia influencia sua confiança nos momentos íntimos?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Você evita conversar sobre suas preocupações íntimas por receio de julgamento?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Gostaria de conhecer estratégias para lidar melhor com essa pressão?", options: ["Não neste momento", "Talvez", "Sim, algumas", "Sim, bastante"] }
];

// Uma experiência única e contínua: 3 questões, pausa visual, 3 questões,
// pausa visual, questão 7, raspadinha obrigatória, reflexão final.
const FLOW: Array<{type: "question"; index: number} | {type: "impact"; index: 0 | 1} | {type:"scratch"} | {type:"result"}> = [
  {type:"question",index:0}, {type:"question",index:1}, {type:"question",index:2},
  {type:"impact",index:0},
  {type:"question",index:3}, {type:"question",index:4}, {type:"question",index:5},
  {type:"impact",index:1},
  {type:"question",index:6}, {type:"scratch"}, {type:"result"}
];

const IMPACTS = [
  {
    index:"01",
    overline:"O CICLO DA PRESSÃO",
    title:"A cobrança pode começar antes mesmo da intimidade.",
    copy:"Expectativas, lembranças e o medo de falhar podem ocupar espaço demais. Perceber esse ciclo ajuda a entender de onde vem a tensão.",
    image:"/images/pressao.jpg",
    alt:"Retrato de um homem em expressão reflexiva",
    action:"ENTENDI, CONTINUAR",
    footer:"PRIMEIRO, ENTENDER. DEPOIS, AGIR."
  },
  {
    index:"02",
    overline:"UM NOVO PONTO DE PARTIDA",
    title:"Você não precisa transformar a intimidade em um teste.",
    copy:"A confiança pode ser trabalhada com menos cobrança, mais diálogo e atenção ao momento. Agora, só falta uma pergunta para concluir sua reflexão.",
    image:"/images/clareza.jpg",
    alt:"Retrato masculino com expressão serena e concentrada",
    action:"QUERO CONTINUAR",
    footer:"MENOS PRESSÃO. MAIS PRESENÇA."
  }
] as const;

function ScratchCard({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const lastPoint = useRef<{x:number; y:number}|null>(null);
  const finished = useRef(false);
  const [opened, setOpened] = useState(false);

  const reveal = () => {
    if (finished.current) return;
    finished.current = true;
    setOpened(true);
    onReveal();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});
    if (!ctx) return;
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const gold = ctx.createLinearGradient(0, 0, width, height);
    gold.addColorStop(0, "#eccd8d");
    gold.addColorStop(.48, "#bd9348");
    gold.addColorStop(1, "#f1d08c");
    ctx.fillStyle = gold;
    ctx.fillRect(0, 0, width, height);
    // Textura discreta gravada no cartão, não depende de imagens externas.
    for(let i=0; i<160; i++){
      const x=((i*127.7)%width), y=((i*59.9)%height);
      ctx.fillStyle = i%3===0 ? "rgba(255,255,255,.20)" : "rgba(77,52,25,.13)";
      ctx.beginPath(); ctx.arc(x,y,i%4===0?1.3:.65,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle = "#241a0d";
    ctx.textAlign = "center";
    ctx.font = "900 " + Math.min(31,Math.max(21,width*.065)) + "px Arial, sans-serif";
    ctx.fillText("RASPE AQUI",width/2,height/2-4);
    ctx.font = "700 12px Arial, sans-serif";
    ctx.fillText("DESLIZE O DEDO PARA REVELAR",width/2,height/2+27);
    ctx.textAlign = "start";
  }, []);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas=canvasRef.current;
    if (!canvas) return {x:0,y:0};
    const rect=canvas.getBoundingClientRect();
    return {x:event.clientX-rect.left,y:event.clientY-rect.top};
  };

  const scratchAt = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if(!dragging.current || finished.current) return;
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!ctx) return;
    const next=point(event);
    ctx.save();
    ctx.globalCompositeOperation="destination-out";
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.lineWidth=48;
    ctx.beginPath();
    if(lastPoint.current) ctx.moveTo(lastPoint.current.x,lastPoint.current.y);
    else ctx.moveTo(next.x,next.y);
    ctx.lineTo(next.x,next.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(next.x,next.y,24,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
    lastPoint.current=next;
  };

  const checkReveal = () => {
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!canvas || !ctx || finished.current) return;
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let clear=0, samples=0;
    for(let i=3;i<data.length;i+=4*18){
      samples++;
      if(data[i]<100) clear++;
    }
    if(samples && clear/samples>=.33) reveal();
  };

  return <div className="eq-scratch-wrap">
    <div className="eq-scratch-surface">
      <div className="eq-scratch-reward" aria-live="polite">
        <span>✦ EIXO · DESBLOQUEADO</span>
        <strong>SEU PONTO DE PARTIDA ESTÁ PRONTO</strong>
        <small>Uma reflexão baseada nas suas respostas está disponível.</small>
      </div>
      <canvas
        ref={canvasRef}
        className={"eq-scratch-canvas" + (opened ? " eq-scratch-open" : "")}
        aria-label="Cartão dourado para raspar e revelar seu próximo passo"
        onPointerDown={e => {
          if(finished.current)return;
          dragging.current=true;
          lastPoint.current=null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratchAt(e);
        }}
        onPointerMove={scratchAt}
        onPointerUp={e => {if(!dragging.current)return; scratchAt(e);dragging.current=false;lastPoint.current=null;checkReveal()}}
        onPointerCancel={() => {dragging.current=false;lastPoint.current=null;checkReveal()}}
        onLostPointerCapture={() => {dragging.current=false;lastPoint.current=null}}
      />
    </div>
    {!opened ? <button type="button" className="eq-accessible-reveal" onClick={reveal}>
      Não consegue raspar? Toque para revelar
    </button> : <p className="eq-reveal-confirmation">✦ Seu próximo passo foi revelado.</p>}
  </div>;
}

function ResultCopy({answers}:{answers:Response[]}) {
  const score=answers.slice(0,6).reduce<number>((total,response)=>total+(response ?? 0),0);
  const level = score<=5 ? {
    kicker:"MENOS PRESSÃO RELATADA",
    heading:"Você percebe poucos episódios de cobrança.",
    text:"Nas respostas de hoje, as preocupações apareceram com menor frequência. Ainda assim, cultivar presença e diálogo pode ser útil."
  } : score<=11 ? {
    kicker:"ALGUMA PRESSÃO RELATADA",
    heading:"A autocobrança aparece em alguns momentos.",
    text:"Você identificou situações em que a preocupação pode afetar sua experiência. Perceber os gatilhos pode ser um bom começo."
  } : {
    kicker:"PRESSÃO FREQUENTE RELATADA",
    heading:"A preocupação parece ocupar bastante espaço.",
    text:"Suas respostas indicam relatos frequentes de pressão. Isso não determina uma causa; se houver sofrimento ou dificuldades persistentes, vale buscar orientação profissional."
  };
  return <div className="eq-result">
    <span className="eq-overline">REFLEXÃO CONCLUÍDA · EIXO</span>
    <h1>O SEU PONTO DE PARTIDA <em>É A CONSCIÊNCIA.</em></h1>
    <div className="eq-result-highlight"><span>{level.kicker}</span><h2>{level.heading}</h2><p>{level.text}</p></div>
    <div className="eq-next-header"><span>PRIMEIROS PASSOS</span><h2>Três atitudes para explorar</h2></div>
    <div className="eq-next-grid">
      <article><span>01</span><strong>OBSERVE</strong><p>Reconheça os pensamentos de cobrança quando eles surgirem, sem se julgar por isso.</p></article>
      <article><span>02</span><strong>RESPIRE</strong><p>Experimente desacelerar, notar a respiração e voltar sua atenção ao momento presente.</p></article>
      <article><span>03</span><strong>CONVERSE</strong><p>Se possível, compartilhe suas preocupações. Procure ajuda profissional se persistirem.</p></article>
    </div>
    <p className="eq-legal">Esta é uma reflexão educativa, não um teste clínico, diagnóstico ou tratamento. Dificuldades íntimas podem ter causas emocionais e físicas diferentes.</p>
  </div>;
}

export default function Quiz(){
  const [screen,setScreen]=useState(0);
  const [answers,setAnswers]=useState<Response[]>(Array(7).fill(null));
  const [scratchRevealed,setScratchRevealed]=useState(false);
  const current=FLOW[screen];
  const answered=answers.filter(a=>a!==null).length;
  const progress=Math.round(answered/QUESTIONS.length*100);
  const choose=(index:number,value:number)=>{
    setAnswers(prev=>{const next=[...prev];next[index]=value;return next;});
    setScreen(prev=>Math.min(prev+1,FLOW.length-1));
  };
  const backward=()=>setScreen(prev=>Math.max(0,prev-1));
  const reset=()=>{setAnswers(Array(7).fill(null));setScratchRevealed(false);setScreen(0);};
  const isLast=current.type==="result";
  const phaseLabel=current.type==="question" ? "PERGUNTA "+(current.index+1)+" DE 7" : current.type==="impact" ? "PAUSA DE REFLEXÃO" : current.type==="scratch" ? "ETAPA FINAL · RASPADINHA" : "SUA REFLEXÃO";
  return <main className="eq-page">
    <header className="eq-header"><div className="eq-header-inner">
      <Link className="eq-brand" href="/" aria-label="EIXO, página inicial"><span className="eq-brand-symbol">E</span><strong>EIXO</strong></Link>
      <span className="eq-header-note"><span className="eq-lock">◆</span> EXPERIÊNCIA DISCRETA</span>
    </div></header>
    <div className="eq-flow">
      <div className="eq-progress-area">
        <div className="eq-progress-header">
          <span>{phaseLabel}</span><span>{isLast?"CONCLUÍDO":progress+"% DAS RESPOSTAS"}</span>
        </div>
        <div className="eq-progress-bar" aria-label={progress+"% das perguntas respondidas"}>
          {QUESTIONS.map((_,index)=><span key={index} className={answers[index]!==null?"eq-progress-done":""}/>)}
        </div>
      </div>

      {current.type==="question" && <section key={"q"+current.index} className="eq-stage eq-question-stage">
        <div className="eq-side-label"><span>0{current.index+1}</span><span>PERFORMANCE MENTAL</span></div>
        <div className="eq-question-content">
          <div className="eq-eyebrow"><span className="eq-dot"/> ENTENDA SUA RELAÇÃO COM A PRESSÃO</div>
          <h1>{QUESTIONS[current.index].title}</h1>
          <p className="eq-helper">Escolha a opção que mais se aproxima da sua experiência.</p>
          <div className="eq-options">{QUESTIONS[current.index].options.map((option,index)=><button
            type="button" key={option}
            className={"eq-option"+(answers[current.index]===index?" eq-option-selected":"")}
            onClick={()=>choose(current.index,index)}>
              <span className="eq-radio"/><span>{option}</span><span className="eq-option-arrow">↗</span>
            </button>)}</div>
        </div>
      </section>}

      {current.type==="impact" && <section key={"impact"+current.index} className="eq-stage eq-impact-stage">
        <div className="eq-impact-copy">
          <span className="eq-overline">REFLEXÃO {IMPACTS[current.index].index} · {IMPACTS[current.index].overline}</span>
          <h1>{IMPACTS[current.index].title}</h1>
          <p>{IMPACTS[current.index].copy}</p>
          <div className="eq-impact-footer">{IMPACTS[current.index].footer}</div>
          <button type="button" className="eq-primary" onClick={()=>setScreen(v=>v+1)}>{IMPACTS[current.index].action}<span>↗</span></button>
        </div>
        <div className="eq-impact-photo"><img src={IMPACTS[current.index].image} alt={IMPACTS[current.index].alt}/><span>CONFIANÇA COMEÇA NA MENTE.</span></div>
      </section>}

      {current.type==="scratch" && <section className="eq-stage eq-scratch-stage">
        <span className="eq-overline">ETAPA FINAL · EIXO</span>
        <h1>VOCÊ CHEGOU ATÉ AQUI.<br/><em>REVELE SEU PRÓXIMO PASSO.</em></h1>
        <p className="eq-scratch-intro">Seu questionário está completo. Raspe o cartão dourado para liberar sua reflexão e conhecer os próximos passos.</p>
        <ScratchCard onReveal={()=>setScratchRevealed(true)}/>
        {scratchRevealed && <button type="button" className="eq-primary eq-scratch-continue" onClick={()=>setScreen(10)}>VER MINHA REFLEXÃO <span>↗</span></button>}
        <p className="eq-scratch-note">Este cartão revela conteúdo educativo. Não é um sorteio nem uma promessa de desconto.</p>
      </section>}

      {current.type==="result" && <section className="eq-stage eq-result-stage"><ResultCopy answers={answers}/>
        <div className="eq-result-actions"><Link href="/" className="eq-primary">CONHECER O EIXO <span>↗</span></Link><button type="button" className="eq-text-button" onClick={reset}>REFAZER QUESTIONÁRIO</button></div>
      </section>}

      <div className="eq-bottom-actions">
        {screen>0 && current.type!=="result" && <button type="button" className="eq-back" onClick={backward}>← VOLTAR</button>}
        <span>SEM RESPOSTAS CERTAS OU ERRADAS</span>
      </div>
    </div>
    <footer className="eq-footer"><span>© EIXO · CONFIANÇA COMEÇA NA MENTE.</span><span>As respostas ficam somente nesta página durante o questionário.</span></footer>
  </main>;
}
