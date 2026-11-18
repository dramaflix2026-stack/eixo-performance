"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import OfferPage from "./offer";
import "./quiz.css";

type Question = { prompt: string; options: string[]; eyebrow?: string };
type Step = { kind: "question"; number: number } | { kind: "story"; number: number } | { kind: "prep" } | { kind: "scratch" } | { kind: "result" };
type StageImage = { src: string; alt: string };

const QUESTIONS: Question[] = [
  {prompt:"Vamos começar. Qual é sua faixa de idade?",options:["18 a 24 anos","25 a 34 anos","35 a 44 anos","45 anos ou mais","Prefiro não informar"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"Em que momento o medo de falhar na hora de transar costuma aparecer?",options:["Antes de transar","Durante o sexo","Depois do sexo, pensando no que aconteceu","Em vários momentos","Não costumo ter esse medo"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"Com que frequência você pensa: “E se eu brochar ou não conseguir na hora H?”",options:["Nunca","Raramente","Às vezes","Frequentemente"],eyebrow:"01 · SEU PERFIL"},
  {prompt:"O que mais tira sua confiança na hora de transar?",options:["Medo de brochar","Preocupação em terminar antes do que gostaria","Medo de não satisfazer a outra pessoa","Não conseguir relaxar e curtir o sexo","Outra preocupação ou nenhuma"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"Se pudesse melhorar uma coisa na sua vida sexual, o que escolheria?",options:["Mais confiança na cama","Menos ansiedade antes do sexo","Mais conexão com a outra pessoa","Conseguir curtir sem me cobrar","Já me sinto bem"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"Quando você vai transar, já sentiu o corpo tenso ou a cabeça acelerada?",options:["Não percebo isso","Raramente","Algumas vezes","Com frequência"],eyebrow:"02 · EXPECTATIVAS"},
  {prompt:"Uma vez que algo deu errado na cama, você ficou com medo de acontecer de novo?",options:["Nunca","Raramente","Às vezes","Frequentemente"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"Você já evitou transar por medo de brochar, falhar ou passar vergonha?",options:["Nunca","Uma vez ou outra","Algumas vezes","Muitas vezes"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"Você consegue falar sobre suas inseguranças sexuais com quem está ao seu lado?",options:["Sim, falo abertamente","Sim, mas fico desconfortável","Quase nunca consigo falar","Não tenho com quem conversar"],eyebrow:"03 · O CICLO DA PRESSÃO"},
  {prompt:"Depois de um dia estressante, sua ansiedade costuma aparecer também na hora do sexo?",options:["Não percebo relação","Um pouco","Moderadamente","Bastante"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Como tem sido seu sono nas últimas semanas?",options:["Tenho dormido bem","Oscila bastante","Durmo menos do que gostaria","Tenho muitas noites ruins"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Você já tentou alguma coisa para controlar a ansiedade antes de transar?",options:["Ainda não tentei","Já tentei respirar ou relaxar","Já conversei com alguém","Já procurei orientação profissional","Tentei outras alternativas"],eyebrow:"04 · SUA ROTINA"},
  {prompt:"Qual é seu status de relacionamento hoje?",options:["Em um relacionamento","Conhecendo alguém","Solteiro","Prefiro não informar"],eyebrow:"05 · CONEXÃO"},
  {prompt:"Na hora de transar, você fica se avaliando em vez de aproveitar o momento?",options:["Quase nenhum","Um pouco","Bastante","É difícil pensar em outra coisa"],eyebrow:"05 · CONEXÃO"},
  {prompt:"O que mais ajuda você a se sentir seguro e à vontade na cama?",options:["Conversar e sentir confiança","Respirar e desacelerar","Ter mais tempo e tranquilidade","Ainda não descobri","Não costumo sentir dificuldade"],eyebrow:"05 · CONEXÃO"},
  {prompt:"Quanto tempo por dia você dedicaria para trabalhar a confiança e controlar a ansiedade?",options:["Até 5 minutos","5 a 10 minutos","10 a 15 minutos","Mais de 15 minutos","Ainda não sei"],eyebrow:"06 · PRÓXIMOS PASSOS"},
  {prompt:"O que você mais quer recuperar na sua vida sexual?",options:["Parar de sofrer com o medo de falhar","Transar com mais presença e confiança","Falar sobre sexo sem vergonha","Não levar o estresse para a cama","Entender o que está acontecendo comigo"],eyebrow:"06 · PRÓXIMOS PASSOS"},
  {prompt:"Você toparia começar com um roteiro de 7 dias para lidar melhor com a ansiedade na hora de transar?",options:["Sim, quero começar","Quero conhecer primeiro","Talvez, ainda estou pensando","Prefiro apenas ver minha reflexão"],eyebrow:"06 · PRÓXIMOS PASSOS"}
];

const STORIES = [
  {badge:"01 / ENTENDER A PRESSÃO",heading:"O MEDO DE BROCHAR PODE COMEÇAR MUITO ANTES DO SEXO.",body:"Às vezes, basta pensar “e se eu falhar?” para a tensão aparecer. Esse ciclo de medo e cobrança é algo que você pode começar a observar e compreender.",photo:"/images/pressao.jpg",alt:"Retrato masculino em reflexão",visual:"breath",button:"ENTENDI, CONTINUAR",tag:"PRESSÃO NÃO DEFINE QUEM VOCÊ É."},
  {badge:"02 / CORPO E MENTE",heading:"QUANDO A CABEÇA NÃO PARA, O SEXO PODE VIRAR UMA PROVA.",body:"O medo de não conseguir pode roubar a atenção do que realmente importa. Respirar, desacelerar e conversar são caminhos possíveis para sair do modo de cobrança.",photo:"/images/clareza.jpg",alt:"Retrato masculino sereno",visual:"wave",button:"CONTINUAR MINHA REFLEXÃO",tag:"MAIS PRESENÇA, MENOS AUTOCONTROLE FORÇADO."},
  {badge:"03 / UMA NOVA PERSPECTIVA",heading:"NÃO É SÓ SOBRE DURAR MAIS. É SOBRE CONSEGUIR CURTIR O SEXO.",body:"Sexo não é uma competição de minutos. Intimidade também envolve desejo, confiança, comunicação e presença. Sua experiência é maior que uma cobrança por desempenho.",photo:"/images/partida.jpg",alt:"Retrato masculino confiante",visual:"split",button:"QUERO AVANÇAR",tag:"O SEU RITMO IMPORTA."},
  {badge:"04 / ROTINA E CONFIANÇA",heading:"O ESTRESSE NÃO FICA DO LADO DE FORA DO QUARTO.",body:"Cansaço, noites ruins e preocupação constante podem influenciar o desejo, a ereção e o conforto na hora do sexo. Olhar para a rotina também faz parte da conversa.",photo:"/images/hero.jpg",alt:"Retrato masculino editorial",visual:"meter",button:"SEGUIR COM O QUESTIONÁRIO",tag:"SEM FÓRMULA MÁGICA. COM MAIS CLAREZA."},
  {badge:"05 / O QUE VEM A SEGUIR",heading:"QUER TRANSAR COM MENOS MEDO? COMECE ENTENDENDO A PRESSÃO.",body:"Depois de reconhecer seus gatilhos, o próximo passo é experimentar estratégias possíveis no seu ritmo. O EIXO organiza um roteiro inicial de atenção, diálogo e rotina.",photo:"/images/clareza.jpg",alt:"Retrato editorial de um homem",visual:"steps",button:"QUERO CONCLUIR",tag:"UM PASSO DE CADA VEZ."}
] as const;

// GIFs enviados pelo proprietário: distribuídos após as perguntas 3, 9 e 15.
// Sem renomear arquivos; os caminhos são servidos pela pasta public/images.
const STORY_GIFS: Record<number,string> = {
  0: "/images/8cR2.gif", // após a pergunta 3
  1: "/images/7CtO.gif", // após a pergunta 6
  2: "/images/BnnZ.gif", // após a pergunta 9
  3: "/images/Fpa.gif", // após a pergunta 12
  4: "/images/KAZE.gif" // após a pergunta 15
};

const HINTS = [
  "O ponto de partida é conhecer você. Só leva alguns segundos.",
  "Pense no que acontece de verdade, mesmo que não seja fácil falar disso.",
  "A frequência desses pensamentos ajuda a identificar padrões de cobrança.",
  "Qual dessas situações mais mexe com a sua segurança na cama?",
  "Não existe meta de desempenho igual para todo mundo.",
  "Tensão e pensamentos acelerados podem aparecer juntos.",
  "Uma experiência ruim não precisa definir a sua vida sexual.",
  "Às vezes, o medo de falhar pesa mais do que a vontade de transar.",
  "Falar sobre sexo pode ser difícil. Responda como acontece com você.",
  "A pressão da rotina nem sempre termina quando o dia acaba.",
  "O descanso pode fazer diferença no seu bem-estar.",
  "Vale considerar o que você já experimentou e como se sentiu.",
  "Essa informação ajuda a contextualizar sua experiência.",
  "Você consegue curtir a intimidade ou fica analisando seu desempenho?",
  "O que te deixa mais seguro quando chega a hora H?",
  "Alguns minutos podem ser suficientes para começar uma reflexão.",
  "Pense na mudança que faria sentido para a sua vida, não na expectativa dos outros.",
  "Depois desta resposta, você poderá revelar seu bônus de 7 dias."
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
  const drawCount=useRef(0);
  const [isRevealed,setIsRevealed]=useState(false);
  const [scratchProgress,setScratchProgress]=useState(0);

  const finish=()=>{
    if(revealed.current)return;
    revealed.current=true;
    dragging.current=false;
    setScratchProgress(100);
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
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha=1;
    const gold=ctx.createLinearGradient(0,0,width,height);
    gold.addColorStop(0,"#f9e0a3");
    gold.addColorStop(.25,"#d4a054");
    gold.addColorStop(.5,"#f0cb7b");
    gold.addColorStop(.8,"#bb883d");
    gold.addColorStop(1,"#f5d58e");
    ctx.fillStyle=gold;
    ctx.fillRect(0,0,width,height);
    for(let i=0;i<165;i++){
      const x=(i*171.73)%width;
      const y=(i*83.31)%height;
      ctx.fillStyle=i%3===0?"rgba(255,255,255,.18)":"rgba(72,43,15,.10)";
      ctx.beginPath();ctx.arc(x,y,i%4===0?1.3:.6,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle="rgba(75,46,17,.32)";
    ctx.lineWidth=1.5;
    ctx.strokeRect(12,12,width-24,height-24);
    ctx.fillStyle="#35210d";
    ctx.textAlign="center";
    ctx.font="900 "+Math.min(12,Math.max(10,width*.022))+"px Arial, sans-serif";
    ctx.fillText("🔥 ESQUENTA BLACK FRIDAY 🔥",width/2,height*.28);
    ctx.font="900 "+Math.min(43,Math.max(24,width*.08))+"px Arial, sans-serif";
    ctx.fillText("RASPE AQUI",width/2,height*.51);
    ctx.font="700 "+Math.min(13,Math.max(10,width*.026))+"px Arial, sans-serif";
    ctx.fillText("DESLIZE O DEDO OU O MOUSE",width/2,height*.51+32);
  },[]);

  const inspect=()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!canvas||!ctx||revealed.current)return;
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let cleared=0,samples=0;
    for(let i=3;i<data.length;i+=4*24){
      samples++;
      if(data[i]<90)cleared++;
    }
    if(!samples)return;
    const ratio=cleared/samples;
    setScratchProgress(Math.min(100,Math.round(ratio*100)));
    // 70% da área raspada: revela todo o restante e celebra com confetes.
    if(ratio>=.70)finish();
  };

  const draw=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!dragging.current||revealed.current)return;
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext("2d",{willReadFrequently:true});
    if(!canvas||!ctx)return;
    const rect=canvas.getBoundingClientRect();
    const point={x:event.clientX-rect.left,y:event.clientY-rect.top};
    ctx.save();
    ctx.globalCompositeOperation="destination-out";
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.lineWidth=62;
    ctx.beginPath();
    if(last.current)ctx.moveTo(last.current.x,last.current.y);
    else ctx.moveTo(point.x,point.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    ctx.beginPath();ctx.arc(point.x,point.y,31,0,Math.PI*2);ctx.fill();
    ctx.restore();
    last.current=point;
    drawCount.current++;
    // Checa durante o gesto, sem exigir que o usuário solte o dedo.
    if(drawCount.current%8===0)inspect();
  };

  return <div className={"funnel-scratch"+(isRevealed?" funnel-scratch-done":"")}>
    <div className="funnel-scratch-card">
      <div className="funnel-scratch-prize">
        <div className="funnel-scratch-gift-head">
          <span>🔥 ESQUENTA BLACK FRIDAY</span><span>EIXO EXCLUSIVO</span>
        </div>
        <div className="funnel-bf-body">
          <span className="funnel-bf-kicker">SEU BÔNUS FOI REVELADO!</span>
          <div className="funnel-bf-amount"><strong>80%</strong><span>OFF</span></div>
          <h2>DESCONTO EXCLUSIVO BLACK FRIDAY</h2>
        </div>
        <div className="funnel-scratch-gift-footer">
          <span>✦ BENEFÍCIO BLACK FRIDAY EIXO</span><span>CONDIÇÕES DA OFERTA NO CHECKOUT</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className={"funnel-scratch-canvas"+(isRevealed?" is-open":"")}
        aria-label="Raspe pelo menos 70 por cento do cartão dourado para revelar seu benefício Black Friday"
        onPointerDown={event=>{
          if(revealed.current)return;
          dragging.current=true;
          last.current=null;
          event.currentTarget.setPointerCapture(event.pointerId);
          draw(event);
        }}
        onPointerMove={draw}
        onPointerUp={event=>{
          if(!dragging.current)return;
          draw(event);
          dragging.current=false;
          last.current=null;
          inspect();
        }}
        onPointerCancel={()=>{dragging.current=false;last.current=null;inspect();}}
        onLostPointerCapture={()=>{dragging.current=false;last.current=null;}}
      />
    </div>
    {isRevealed&&<div className="funnel-scratch-confetti" aria-hidden="true">
      {Array.from({length:64},(_,i)=><i key={i} style={{
        left:(3+(i*37.29)%94)+"%",
        bottom:(12+(i*11)%45)+"px",
        backgroundColor:["#ffda8f","#e3a94c","#fff4d5","#cc8f39","#f7c86a"][i%5],
        width:(5+i%5)+"px",
        height:(9+(i%4)*3)+"px",
        animationDelay:((i*0.047)%0.52)+"s",
        animationDuration:(1.4+((i*13)%9)*.13)+"s",
        "--drift":(((i*79)%280)-140)+"px",
        "--drift2":(((i*43)%440)-220)+"px"
      } as CSSProperties}/>)}
    </div>}
    {isRevealed?
      <p className="funnel-scratch-caption">🎉 80% OFF LIBERADO · BLACK FRIDAY EIXO</p>:
      <div className="funnel-scratch-progress">
        <div className="funnel-scratch-progress-track"><i style={{width:scratchProgress+"%"}}/></div>
        <span>{scratchProgress>0?scratchProgress+"% RASPADO · REVELA AOS 70%":"RASPE ATÉ 70% PARA REVELAR"}</span>
        <button type="button" className="funnel-scratch-alt" onClick={finish}>
          Não consegue raspar? Revelar por toque
        </button>
      </div>}
  </div>;
}

const QUESTION_ICONS: string[][] = [
  ["👨‍🦱","👨","🧔","👨‍🦳","◎"],
  ["🌅","✦","🌙","↻","✓"],
  ["🧠","☁️","💭","⚡"],
  ["⚡","⏱️","♥️","🌿","◎"],
  ["✦","🌿","♥️","☀️","✓"],
  ["◎","🌤️","⚡","🌪️"],
  ["✓","💭","↻","⚡"],
  ["✓","🌙","💭","↻"],
  ["💬","🗣️","🤐","◎"],
  ["🌿","☁️","⚡","🌪️"],
  ["🌙","☁️","⏳","💤"],
  ["◎","🌬️","💬","✦","✓"],
  ["♥️","✦","◎","—"],
  ["◎","💭","⚡","🧠"],
  ["💬","🌿","⏳","◎","✓"],
  ["⚡","⏱️","⌛","☀️","◎"],
  ["✦","♥️","💬","🌿","🧠"],
  ["✓","✦","◎","◌"]
];
function questionOptionIcon(question:number,index:number):string {
  return QUESTION_ICONS[question]?.[index] ?? "✦";
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
  const isGuided=step.kind==="question"||step.kind==="story"||step.kind==="prep";
  const questionNumber=step.kind==="question"?step.number:0;
  const guidedProgress=step.kind==="question"?step.number+1:answered;
  const guidedPhase=step.kind==="story"?"Momento "+(step.number+1)+" de 5":
    step.kind==="prep"?"Seu plano":
    questionNumber<3?"Perfil":questionNumber<6?"Expectativas":
    questionNumber<9?"Pressão":questionNumber<12?"Rotina":
    questionNumber<15?"Conexão":"Seu plano";
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

  return <main className={"funnel-page"+(isGuided?" is-guided":"")+(step.kind==="story"?" is-story":"")+(step.kind==="prep"?" is-prep":"")}>
    {isGuided?
      <header className="funnel-header funnel-quiz-header">
        <div className="funnel-quiz-top">
          {position===0?
            <Link href="/" className="funnel-quiz-back" aria-label="Voltar à página inicial">←</Link>:
            <button type="button" className="funnel-quiz-back" onClick={goBack} aria-label="Voltar para a etapa anterior">←</button>}
          <Link href="/" className="funnel-quiz-logo" aria-label="EIXO, página inicial">E<span>I</span>XO</Link>
          <span className="funnel-quiz-phase">{guidedPhase}</span>
        </div>
        <div className="funnel-quiz-header-progress" role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={18} aria-valuenow={guidedProgress}>
          {Array.from({length:4},(_,i)=><i key={i}><span style={{width:(Math.max(0,Math.min(1,(guidedProgress/18)*4-i))*100)+"%"}}/></i>)}
        </div>
      </header>
      :
      <header className="funnel-header"><div className="funnel-header-inner">
        <Link href="/" className="funnel-brand" aria-label="EIXO, página inicial"><span>◈</span>EIXO</Link>
        <div className="funnel-private">◉ &nbsp; CONTEÚDO DISCRETO E EDUCATIVO</div>
      </div></header>}
    <div className={"funnel-content"+(step.kind==="result"?" funnel-content-offer":"")}>
      {showProgress&&!isGuided&&<div className="funnel-progress">
        <div className="funnel-progress-line"><span>{currentLabel}</span><span>{progress}% CONCLUÍDO</span></div>
        <div className="funnel-progress-segments">{Array.from({length:6},(_,i)=><i key={i} style={{background:answered>=((i+1)*3)?"#d9a95f":"#35302a"}}/>)}</div>
      </div>}

      {step.kind==="question"&&<section className="funnel-question" key={"q"+questionNumber}>
        {questionNumber===0?
          <div className="funnel-quiz-intro">Vamos começar!</div>:
          <span className="funnel-quiz-step-label">PERGUNTA {questionNumber+1} DE 18 · {QUESTIONS[questionNumber].eyebrow?.split(" · ").slice(1).join(" · ")}</span>}
        <h1>{QUESTIONS[questionNumber].prompt}</h1>
        <p className="funnel-quiz-hint">{HINTS[questionNumber]}</p>
        <div className="funnel-options" role="group" aria-label={"Respostas da pergunta "+(questionNumber+1)}>
          {QUESTIONS[questionNumber].options.map((label,index)=><button
            key={label}
            type="button"
            aria-pressed={answers[questionNumber]===index}
            className={"funnel-option"+(answers[questionNumber]===index?" is-selected":"")}
            onClick={()=>select(index)}>
              <span className="funnel-option-icon" aria-hidden="true">{questionOptionIcon(questionNumber,index)}</span>
              <span className="funnel-option-label">{label}</span>
              <span className="funnel-radio" aria-hidden="true"/>
          </button>)}
        </div>
      </section>}

      {step.kind==="story"&&<section className="funnel-story" key={"story"+step.number}>
        <span className="funnel-tag">{STORIES[step.number].badge}</span>
        <h1>{STORIES[step.number].heading}</h1>
        <div className={"funnel-story-media"+(STORY_GIFS[step.number]?" has-gif":"")}>
          <img
            src={STORY_GIFS[step.number] ?? STORIES[step.number].photo}
            alt={STORY_GIFS[step.number] ? "Animação ilustrativa da pausa "+(step.number+1)+" do questionário EIXO" : STORIES[step.number].alt}
            loading="eager"
            onError={event => {
              // Se um arquivo animado falhar, exibe a fotografia local já existente.
              if(event.currentTarget.src.endsWith(".gif")) {
                event.currentTarget.src=STORIES[step.number].photo;
                event.currentTarget.classList.add("funnel-gif-fallback");
              }
            }}
          />
          {!STORY_GIFS[step.number] && <div className="funnel-story-overlay"><StoryAnimation variant={STORIES[step.number].visual}/></div>}
          {!STORY_GIFS[step.number] && <span className="funnel-story-media-tag">EIXO / PERFORMANCE MENTAL</span>}
        </div>
        <p>{STORIES[step.number].body}</p>
        <div className="funnel-story-foot">{STORIES[step.number].tag}</div>
        <button className="funnel-main-cta" type="button" onClick={()=>setPosition(pos=>pos+1)}>{STORIES[step.number].button} <span>↗</span></button>
      </section>}

      {step.kind==="prep"&&<section className="funnel-prep">
        <span className="funnel-tag">18 / 18 PERGUNTAS RESPONDIDAS</span>
        <div className="funnel-icon">◈</div>
        <h1>SEU PONTO DE PARTIDA ESTÁ <em>PRONTO.</em></h1>
        <p>Você respondeu sobre medo de falhar, insegurança e estresse. Agora falta só revelar o seu bônus educativo de 7 dias.</p>
        <div className="funnel-private-panel"><span>◈ PRIVACIDADE EM PRIMEIRO LUGAR</span>
          <p>Sem cadastro, sem envio das respostas para um servidor. Você pode informar um nome para personalizar a tela final, se quiser.</p>
          <label htmlFor="eixo-display-name">COMO PODEMOS TE CHAMAR? <small>(OPCIONAL)</small></label>
          <input id="eixo-display-name" value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="Seu primeiro nome"/>
        </div>
        <div className="funnel-offer-perks"><span>✓ 18 respostas consideradas</span><span>✓ Roteiro inicial de 7 dias</span><span>✓ Experiência discreta</span></div>
        <button type="button" className="funnel-main-cta" onClick={()=>setPosition(pos=>pos+1)}>LIBERAR MINHA RASPADINHA <span>↗</span></button>
      </section>}

      {step.kind==="scratch"&&<section className="funnel-scratch-step">
        <span className="funnel-tag">🔥 ESQUENTA BLACK FRIDAY · EIXO</span>
        <h1>{name.trim()?name.trim().slice(0,40)+", ":""}SEU PRESENTE ESTÁ NESTA <em>RASPADINHA.</em></h1>
        <p>Raspe o dourado com o dedo ou mouse. Ao chegar a 70%, o restante desaparece e você descobre seu bônus Black Friday.</p>
        <ScratchCard key={restartKey} onReveal={()=>setRevealed(true)}/>
        {revealed&&<button type="button" className="funnel-main-cta funnel-scratch-next" onClick={()=>setPosition(FINISH_INDEX)}>CONTINUAR COM MEU BÔNUS <span>↗</span></button>}
        <small>Campanha Esquenta Black Friday EIXO. O desconto de 80% precisará ser configurado e validado na etapa de pagamento.</small>
      </section>}

      {step.kind==="result"&&<OfferPage answers={answers} name={name} onReset={reset}/>} 

      {position>0&&step.kind!=="result"&&!isGuided&&<button type="button" onClick={goBack} className="funnel-back">← VOLTAR</button>}
    </div>
    {!isGuided&&<footer className="funnel-footer"><span>© EIXO · CONFIANÇA COMEÇA NA MENTE</span><span>Conteúdo educativo. As respostas permanecem apenas nesta página.</span></footer>}
  </main>;
}
