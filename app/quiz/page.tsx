"use client";
import { useState } from "react";
import Link from "next/link";

const questions = [
  { title: "Antes de um momento íntimo, com que frequência você fica preocupado com seu desempenho?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Você sente que precisa corresponder a uma expectativa ou provar alguma coisa?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Durante a intimidade, você percebe que está mais atento ao próprio desempenho do que ao momento?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Uma experiência anterior desagradável aumenta sua preocupação com as próximas?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "O estresse da rotina parece influenciar sua confiança nos momentos íntimos?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Você evita conversar sobre preocupações íntimas por receio de julgamento?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"] },
  { title: "Você gostaria de aprender estratégias para lidar melhor com essa pressão?", options: ["Não neste momento", "Talvez", "Sim, algumas", "Sim, bastante"] }
];

export default function Quiz() {
 const [step,setStep] = useState(0);
 const [answers,setAnswers] = useState<number[]>([]);
 const finished = step >= questions.length;
 const choose = (value:number) => { setAnswers(prev => [...prev.slice(0,step),value]); setStep(step+1); };
 const restart = () => {setAnswers([]);setStep(0)};
 const score = answers.slice(0,6).reduce((a,b)=>a+b,0);
 const interpretation = score <= 5 ? "Você relatou poucas situações de pressão nesta reflexão." : score <= 11 ? "Você relatou algumas situações de pressão ou preocupação." : "Você relatou preocupações frequentes que podem merecer atenção e acolhimento.";
 return <main className="quiz-shell">
  <header className="quiz-header"><Link className="quiz-brand" href="/"><span>◉</span> EIXO</Link><span className="quiz-discreet">Espaço reservado e educativo</span></header>
  <section className="quiz-panel" aria-live="polite">
   {!finished ? <>
    <div className="quiz-meta"><span>REFLEXÃO {step+1} DE {questions.length}</span><span>{Math.round(step/questions.length*100)}%</span></div>
    <div className="quiz-track"><div style={{width: (step/questions.length*100)+"%"}} /></div>
    <p className="quiz-kicker">Entenda sua relação com a pressão</p>
    <h1 className="quiz-title">{questions[step].title}</h1>
    <p className="quiz-hint">Escolha a alternativa que mais se aproxima da sua experiência.</p>
    <div className="quiz-options">{questions[step].options.map((option,index)=><button type="button" className="quiz-option" key={option} onClick={()=>choose(index)}><span className="quiz-option-ring" />{option}<span className="quiz-option-arrow">→</span></button>)}</div>
    <div className="quiz-bottom">{step > 0 && <button className="quiz-back" type="button" onClick={()=>setStep(step-1)}>← Voltar</button>}<span>Sem respostas certas ou erradas</span></div>
   </> : <>
    <p className="quiz-kicker">REFLEXÃO CONCLUÍDA</p>
    <h1 className="quiz-title">A confiança começa por entender o que você sente.</h1>
    <p className="quiz-result">{interpretation}</p>
    <p className="quiz-hint">Este resultado é apenas uma reflexão sobre suas respostas, não uma pontuação clínica, diagnóstico ou avaliação psicológica. Dificuldades persistentes podem ter múltiplas causas; profissionais de saúde podem ajudar a investigá-las.</p>
    <div className="quiz-result-actions"><Link className="cta" href="/">Conhecer o EIXO →</Link><button className="quiz-back" type="button" onClick={restart}>Refazer questionário</button></div>
   </>}
  </section>
  <footer className="quiz-footer">Suas respostas permanecem nesta página durante o questionário e não são enviadas ao servidor. © EIXO</footer>
 </main>;
}
