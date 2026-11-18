"use client";

import {useCallback,useEffect,useRef,useState} from "react";

const SLIDES=Array.from({length:8},(_,i)=>({
  id:i+1,
  src:"/images/eixo-feedback-"+String(i+1).padStart(2,"0")+".svg",
  label:"Conversa ilustrativa "+String(i+1).padStart(2,"0")
}));
const INTERVAL_MS=5100;

export default function FeedbackCarousel(){
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [inView,setInView]=useState(false);
  const trackRef=useRef<HTMLDivElement>(null);
  const sectionRef=useRef<HTMLElement>(null);

  const move=useCallback((next:number)=>{
    setIndex((next+SLIDES.length)%SLIDES.length);
  },[]);

  useEffect(()=>{
    const root=sectionRef.current;
    if(!root||typeof IntersectionObserver==="undefined"){setInView(true);return;}
    const observer=new IntersectionObserver(entries=>{
      setInView(Boolean(entries[0]?.isIntersecting));
    },{threshold:0.20});
    observer.observe(root);
    return ()=>observer.disconnect();
  },[]);

  useEffect(()=>{
    if(paused||!inView||document.hidden||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const timer=window.setInterval(()=>{
      if(!document.hidden)setIndex(i=>(i+1)%SLIDES.length);
    },INTERVAL_MS);
    return ()=>window.clearInterval(timer);
  },[paused,inView]);

  useEffect(()=>{
    const track=trackRef.current;
    const slide=track?.children[index] as HTMLElement|undefined;
    if(!track||!slide)return;
    const left=slide.offsetLeft-(track.clientWidth-slide.clientWidth)/2;
    track.scrollTo({left,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  },[index]);

  const syncSwipe=()=>{
    window.setTimeout(()=>{
      const track=trackRef.current;
      if(!track)return;
      const center=track.scrollLeft+track.clientWidth/2;
      let closest=0;let distance=Infinity;
      Array.from(track.children).forEach((element,i)=>{
        const card=element as HTMLElement;
        const d=Math.abs(card.offsetLeft+card.clientWidth/2-center);
        if(d<distance){closest=i;distance=d;}
      });
      setIndex(closest);
    },250);
  };

  return <section ref={sectionRef} className="eixo-feedback-section" id="eixo-exemplos" aria-label="Galeria de conversas ilustrativas sobre o Método EIXO">
    <div className="eixo-feedback-heading">
      <span>◈ EIXO · CONVERSAS EM FORMATO VERTICAL</span>
      <h2>A CONFIANÇA COMEÇA <em>QUANDO VOCÊ SE ESCUTA.</em></h2>
      <p>Deslize para conhecer situações e reflexões sobre confiança, pressão e intimidade.</p>
    </div>
    <div className="eixo-feedback-carousel" role="region" aria-roledescription="carrossel" aria-label="Exemplos ilustrativos de conversas" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setPaused(false);}}>
      <div ref={trackRef} className="eixo-feedback-track" tabIndex={0} role="group" aria-label="Deslize horizontalmente entre as imagens" onTouchStart={()=>setPaused(true)} onTouchEnd={()=>{syncSwipe();setPaused(false);}} onMouseUp={syncSwipe} onKeyDown={event=>{
        if(event.key==="ArrowRight"){event.preventDefault();move(index+1);}
        if(event.key==="ArrowLeft"){event.preventDefault();move(index-1);}
      }}>
        {SLIDES.map((item,i)=><figure key={item.id} className={"eixo-feedback-slide"+(i===index?" is-active":"")} aria-label={item.label}>
          <img src={item.src} width={720} height={1280} loading={i===0?"eager":"lazy"} alt={"Imagem vertical de conversa fictícia sobre o Método EIXO, exemplo "+(i+1)+" de "+SLIDES.length}/>
        </figure>)}
      </div>
      <div className="eixo-feedback-controls">
        <button type="button" className="eixo-feedback-arrow" aria-label="Imagem anterior" onClick={()=>move(index-1)}>‹</button>
        <div className="eixo-feedback-dots" aria-label="Selecionar imagem">
          {SLIDES.map((item,i)=><button key={item.id} type="button" className={i===index?"is-active":""} aria-label={"Ir para imagem "+(i+1)} aria-current={i===index?"true":undefined} onClick={()=>move(i)}/>)}
        </div>
        <button type="button" className="eixo-feedback-arrow" aria-label="Próxima imagem" onClick={()=>move(index+1)}>›</button>
      </div>
      <p className="eixo-feedback-counter" aria-live="polite">{String(index+1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")} <span>·</span> PASSAGEM AUTOMÁTICA</p>
    </div>
    <p className="eixo-feedback-disclaimer">Imagens e conversas fictícias, criadas para ilustrar os temas do EIXO. Não são depoimentos verificados nem comprovam resultados.</p>
  </section>;
}
