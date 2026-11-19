"use client";
import "./member-home.css";
type Lesson={day:number;title:string;estimatedMinutes:number};
type Props={firstName:string;completedDays:number[];lessons:Lesson[];onExplore:()=>void;onJourney:(day:number)=>void;onCalendar:()=>void;onTools:()=>void};
export function EixoMemberHome({firstName,completedDays,lessons,onExplore,onJourney,onCalendar,onTools}:Props){
 const next=lessons.find(x=>!completedDays.includes(x.day))||lessons[lessons.length-1];
 const progress=Math.round(completedDays.length/Math.max(lessons.length,1)*100);
 return <section className="eixo-new-home">
 <div className="eixo-new-home-hero"><div className="eixo-new-home-hero-content"><span>✦ SEU ESPAÇO / MÉTODO EIXO</span><h2>{firstName}, seu próximo passo <em>começa aqui.</em></h2><p>Uma jornada de aprendizado, presença e autoconhecimento. Escolha uma experiência e avance no seu próprio ritmo.</p><div className="eixo-new-home-actions"><button type="button" onClick={()=>next&&onJourney(next.day)}>▶ CONTINUAR JORNADA</button><button type="button" onClick={onExplore}>EXPLORAR CONTEÚDOS ↗</button></div></div><div className="eixo-new-home-hero-stat"><span>SUA JORNADA INICIAL</span><strong>{progress}%</strong><div className="eixo-new-home-meter"><span style={{width:progress+"%"}}/></div><small>{completedDays.length} de {lessons.length} etapas concluídas</small></div></div>
 <div className="eixo-new-home-heading"><span>O QUE VOCÊ QUER FAZER HOJE?</span><h3>Seu EIXO, do seu jeito.</h3></div>
 <div className="eixo-new-home-grid"><button type="button" onClick={()=>next&&onJourney(next.day)}><span>01 / APRENDIZAGEM</span><strong>Minha Jornada</strong><p>{next?"Próxima etapa: "+next.title:"Explore sua jornada inicial."}</p><em>CONTINUAR ↗</em></button><button type="button" onClick={onExplore}><span>02 / BIBLIOTECA</span><strong>Explorar</strong><p>Sete etapas e cinco materiais complementares em um catálogo visual.</p><em>VER CATÁLOGO ↗</em></button><button type="button" onClick={onCalendar}><span>03 / REFLEXÃO</span><strong>Meu Diário</strong><p>Registre seu dia de maneira privada e opcional.</p><em>ABRIR DIÁRIO ↗</em></button><button type="button" onClick={onTools}><span>04 / AUTOCUIDADO</span><strong>Ferramentas</strong><p>Orientações, movimento, alimentação e pausa guiada.</p><em>EXPLORAR ↗</em></button></div>
 <div className="eixo-new-home-footer"><strong>Um passo por vez.</strong><p>Você não precisa completar tudo hoje. Seu progresso na jornada é salvo na sua conta.</p></div>
 </section>;
}
