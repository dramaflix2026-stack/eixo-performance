"use client";
import {useState} from "react";
import {EIXO_MEDIA,type EixoMediaItem} from "./media-manifest";
import "./media-library.css";

export function EixoMediaLibrary(){
 const [kind,setKind]=useState<"todos"|"video"|"audio">("todos");
 const [active,setActive]=useState<EixoMediaItem|null>(null);
 const [failed,setFailed]=useState(false);
 const items=EIXO_MEDIA.filter(x=>kind==="todos"||x.kind===kind);
 return <section className="eixo-media" aria-labelledby="eixo-media-title">
  <header><span>05 / CONTEÚDO AUDIOVISUAL</span><h2 id="eixo-media-title">Assista. Escute. <em>Pratique.</em></h2><p>Um espaço reservado para vídeos e áudios do Método EIXO, com reprodução no próprio aplicativo.</p></header>
  <div className="eixo-media-filters" aria-label="Tipo de mídia">{([["todos","Todos"],["video","Vídeos"],["audio","Áudios"]] as const).map(([id,label])=><button type="button" key={id} className={kind===id?"active":""} aria-pressed={kind===id} onClick={()=>{setKind(id);setActive(null);setFailed(false)}}>{label}</button>)}</div>
  {active&&<section className="eixo-media-player" aria-label={"Reproduzindo "+active.title}>
   <div className="eixo-media-player-top"><div><span>{active.kind==="video"?"VÍDEO":"ÁUDIO"} · {active.category}</span><h3>{active.title}</h3></div><button type="button" onClick={()=>{setActive(null);setFailed(false)}}>Fechar ✕</button></div>
   {active.kind==="video"?<video key={active.id} controls playsInline preload="metadata" poster={active.poster} controlsList="nodownload" onError={()=>setFailed(true)}><source src={active.src}/><p>Seu navegador não consegue reproduzir este vídeo.</p></video>:<audio key={active.id} controls preload="none" onError={()=>setFailed(true)}><source src={active.src}/><p>Seu navegador não consegue reproduzir este áudio.</p></audio>}
   {failed&&<p role="alert" className="eixo-media-error">Este arquivo não está disponível no momento. Tente novamente mais tarde.</p>}
   <p>{active.description}</p>
  </section>}
  {items.length?<div className="eixo-media-grid">{items.map(item=><button type="button" key={item.id} onClick={()=>{setActive(item);setFailed(false)}} className="eixo-media-card"><div className="eixo-media-cover" style={item.poster?{backgroundImage:`linear-gradient(0deg,#08090be8,transparent),url("${item.poster}")`}:undefined}><span>{item.kind==="video"?"▶":"♫"}</span></div><div><small>{item.kind==="video"?"VÍDEO":"ÁUDIO"} · {item.durationLabel||item.category}</small><strong>{item.title}</strong><span>REPRODUZIR ↗</span></div></button>)}</div>:
  <div className="eixo-media-empty"><span>◉</span><h3>{kind==="todos"?"Biblioteca audiovisual em preparação":kind==="video"?"Vídeos em preparação":"Áudios em preparação"}</h3><p>Os materiais audiovisuais serão disponibilizados aqui após a inclusão de arquivos próprios ou licenciados. As atividades escritas e os bônus já disponíveis continuam acessíveis nas outras abas.</p></div>}
  <aside className="eixo-media-notice">Conteúdos educativos. Não substituem acompanhamento médico ou psicológico. O progresso da jornada não depende de assistir a vídeos ou ouvir áudios.</aside>
 </section>;
}
