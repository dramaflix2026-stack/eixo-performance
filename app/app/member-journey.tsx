"use client";
import "./journey.css";

type Lesson={day:number;phase:string;title:string;estimatedMinutes:number};
type Props={lessons:Lesson[];completedDays:number[];onOpenLesson:(day:number)=>void};
export function EixoJourney({lessons,completedDays,onOpenLesson}:Props){
 const done=new Set(completedDays);
 const total=lessons.length;
 const count=lessons.filter(x=>done.has(x.day)).length;
 const percent=total?Math.round(count/total*100):0;
 const next=lessons.find(x=>!done.has(x.day));
 const minutes=lessons.filter(x=>done.has(x.day)).reduce((sum,x)=>sum+x.estimatedMinutes,0);
 return <section className="eixo-journey" aria-labelledby="eixo-journey-title">
  <header className="eixo-journey-head"><span>04 / MINHA JORNADA</span><h2 id="eixo-journey-title">Cada passo <em>tem valor.</em></h2><p>Acompanhe as atividades que você escolheu concluir. Não há notas, ranking nem metas de desempenho íntimo.</p></header>
  <div className="eixo-journey-summary">
   <div className="eixo-journey-primary"><span>SEU CAMINHO</span><strong>{percent}%</strong><div className="eixo-journey-bar" role="progressbar" aria-label="Atividades concluídas" aria-valuenow={count} aria-valuemin={0} aria-valuemax={total}><span style={{width:percent+"%"}}/></div><p>{count} de {total} etapas concluídas</p></div>
   <div className="eixo-journey-stat"><span>ETAPAS REALIZADAS</span><strong>{count}<small> / {total}</small></strong><p>Registros que você marcou como concluídos</p></div>
   <div className="eixo-journey-stat"><span>TEMPO ESTIMADO</span><strong>{minutes}<small> min</small></strong><p>Soma da duração prevista das etapas concluídas, não tempo efetivamente medido</p></div>
  </div>
  <div className="eixo-journey-timeline"><div className="eixo-journey-title"><h3>Seu roteiro de sete etapas</h3><span>{count===total&&total>0?"ROTEIRO CONCLUÍDO":"NO SEU TEMPO"}</span></div>
   <div className="eixo-journey-steps">{lessons.map(l=><button type="button" key={l.day} className={"eixo-journey-step"+(done.has(l.day)?" completed":"")} onClick={()=>onOpenLesson(l.day)}>
    <span className="eixo-journey-number">{done.has(l.day)?"✓":String(l.day).padStart(2,"0")}</span>
    <span className="eixo-journey-step-copy"><small>{l.phase} · {l.estimatedMinutes} MIN PREVISTOS</small><strong>{l.title}</strong><em>{done.has(l.day)?"Etapa concluída":"Explorar esta etapa"}</em></span><span className="eixo-journey-arrow">↗</span>
   </button>)}</div>
  </div>
  <div className="eixo-journey-bottom"><div><strong>{next?"Pronto para seu próximo passo?":"Você percorreu as sete etapas."}</strong><p>{next?"Retome quando fizer sentido para você. O progresso é salvo na sua conta.":"Você pode revisitar qualquer etapa e ajustar as marcações quando quiser."}</p></div><button type="button" onClick={()=>onOpenLesson(next?.day??lessons[0]?.day??1)}>{next?"CONTINUAR JORNADA":"REVISITAR JORNADA"} ↗</button></div>
  <p className="eixo-journey-note">Os indicadores representam somente a conclusão de conteúdos educativos. Não medem saúde, desempenho sexual ou resultados clínicos.</p>
 </section>;
}
