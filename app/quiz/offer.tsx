"use client";

import { useState } from "react";
import "./offer.css";

type OfferProps={answers:(number|null)[];name:string;onReset:()=>void};
type Bonus={num:string;icon:string;title:string;subtitle:string;format:string;eyebrow:string;duration:string;chapters:{heading:string;copy:string}[];action:string};
const ANSWERS={
  age:["18 a 24 anos","25 a 34 anos","35 a 44 anos","45 anos ou mais","Não informado"],
  moment:["Antes de transar","Durante o sexo","Depois do sexo","Em vários momentos","Não sinto essa pressão"],
  concern:["Medo de brochar","Tempo da relação","Receio de não satisfazer","Dificuldade em relaxar","Outra preocupação ou nenhuma"],
  focus:["Reduzir o medo de falhar","Transar com mais presença","Falar sobre sexo sem vergonha","Não levar o estresse para a cama","Entender meus sentimentos"],
  time:["Até 5 minutos","5 a 10 minutos","10 a 15 minutos","Mais de 15 minutos","Ainda não sei"],
  relationship:["Em um relacionamento","Conhecendo alguém","Solteiro","Prefiro não informar"]
};
const DAYS=[
  {day:"01",tag:"RECONHECER",title:"Identifique a autocobrança",text:"Observe situações em que surge o pensamento de falhar. Anote o que você sentiu, sem tentar se julgar."},
  {day:"02",tag:"DESACELERAR",title:"Saia do piloto automático",text:"Faça uma pausa breve para notar o ritmo da respiração e relaxar os ombros. Não precisa provar nada nessa prática."},
  {day:"03",tag:"EXPECTATIVAS",title:"Questione a pressão de desempenho",text:"Escreva uma expectativa que costuma cobrar de si mesmo e reflita se ela é realmente necessária para uma boa experiência."},
  {day:"04",tag:"CONEXÃO",title:"Pratique uma conversa honesta",text:"Se houver segurança e abertura, diga o que ajuda você a se sentir confortável, sem transformar sexo em uma prova."},
  {day:"05",tag:"PRESENÇA",title:"Treine atenção ao presente",text:"Em uma atividade cotidiana tranquila, observe sensações, sons e a própria respiração. O objetivo é praticar presença."},
  {day:"06",tag:"ROTINA",title:"Olhe para sono e estresse",text:"Note como cansaço e preocupações influenciam seu bem-estar. Priorize um ajuste pequeno e possível na sua rotina."},
  {day:"07",tag:"REVISÃO",title:"Escolha seu próximo passo",text:"Revise as anotações e escolha o que vale continuar. Em caso de sofrimento ou dificuldade persistente, procure orientação profissional."}
];
const BONUSES:Bonus[]=[
  {
    num:"01",icon:"◎",title:"Protocolo SOS — Antes de Transar",
    subtitle:"Uma sequência guiada de cinco minutos para desacelerar antes da hora H",
    format:"PROTOCOLO GUIADO EM TEXTO",eyebrow:"MENOS PRESSÃO, MAIS PRESENÇA",duration:"5 MINUTOS",
    chapters:[
      {heading:"Minuto 1 · Reconheça a preocupação",copy:"Faça uma pausa. Perceba se surgiu algum pensamento do tipo ‘e se eu falhar?’. Não tente se convencer de que ele não existe. Apenas reconheça que é um pensamento, não uma previsão."},
      {heading:"Minuto 2 · Volte ao ambiente",copy:"Com os pés apoiados no chão, observe três elementos ao seu redor. Se for confortável, relaxe ombros e mandíbula. A intenção é voltar a atenção ao presente, não controlar o corpo."},
      {heading:"Minuto 3 · Respire no seu ritmo",copy:"Respire naturalmente, sem prender o ar nem forçar inspirações profundas. Observe o movimento do ar entrando e saindo por alguns instantes."},
      {heading:"Minuto 4 · Troque a cobrança por uma intenção",copy:"Em vez de ‘preciso durar’ ou ‘não posso falhar’, experimente: ‘quero viver esse momento respeitando o meu conforto e o da outra pessoa’."},
      {heading:"Minuto 5 · Decida sem pressa",copy:"Pergunte a si mesmo: estou confortável? Quero continuar? Preciso conversar, desacelerar ou mudar de ideia? Você não tem obrigação de transar nem de atingir um resultado."}
    ],
    action:"Experimente esta pausa como prática de atenção; ela não garante melhora de ereção, duração ou ansiedade."
  },
  {
    num:"02",icon:"↗",title:"Manual — E Se Eu Brochar?",
    subtitle:"Como lidar com o medo de perder a ereção sem transformar o momento em fracasso",
    format:"MANUAL PRÁTICO",eyebrow:"SEM VERGONHA, SEM AUTOSSABOTAGEM",duration:"4 PARTES",
    chapters:[
      {heading:"01 · Um episódio não define sua sexualidade",copy:"Oscilações de ereção podem acontecer por diferentes motivos. Uma experiência isolada não diz tudo sobre seu desejo, sua masculinidade ou sua saúde."},
      {heading:"02 · O que fazer na hora",copy:"Se algo sair diferente do esperado, evite se cobrar para ‘corrigir’ imediatamente. É possível conversar, desacelerar, mudar o foco para o conforto mútuo ou encerrar o momento com respeito."},
      {heading:"03 · O que evitar depois",copy:"Não transforme o episódio em uma identidade (‘sempre vou falhar’). Anote o contexto com curiosidade, sem criar uma obrigação de ‘compensar’ na próxima vez."},
      {heading:"04 · Quando procurar orientação",copy:"Se a dificuldade de ereção for recorrente, persistente, causar sofrimento ou começar de repente, procure um profissional de saúde. Questões vasculares, hormonais, medicamentos e fatores emocionais podem estar envolvidos."}
    ],
    action:"Apoio profissional é especialmente importante diante de mudanças súbitas ou persistentes. Este manual não substitui avaliação clínica."
  },
  {
    num:"03",icon:"✦",title:"Sexo Sem Vergonha — Guia de Conversas",
    subtitle:"Frases prontas para falar de insegurança, desejo e expectativas",
    format:"GUIA COM EXEMPLOS",eyebrow:"CONEXÃO COMEÇA COM DIÁLOGO",duration:"5 SITUAÇÕES",
    chapters:[
      {heading:"01 · Para iniciar sem constrangimento",copy:"‘Queria conversar sobre uma coisa íntima. Às vezes fico inseguro e acho que preciso corresponder a uma expectativa. Você topa me ouvir?’"},
      {heading:"02 · Para aliviar a pressão",copy:"‘Eu gosto de estar com você e me sinto mais tranquilo quando a gente não transforma o sexo em uma prova de desempenho.’"},
      {heading:"03 · Para perguntar o que a outra pessoa deseja",copy:"‘O que faz você se sentir confortável? Quero entender o que funciona para nós, sem presumir que eu já sei.’"},
      {heading:"04 · Quando algo não sai como esperado",copy:"‘Fiquei um pouco ansioso agora. Podemos desacelerar, conversar ou mudar de ideia? Não quero fingir que está tudo bem se não estou à vontade.’"},
      {heading:"05 · Para falar sobre limites",copy:"‘Se eu quiser parar ou fazer uma pausa, quero poder dizer isso. E quero que você também se sinta livre para me falar o que precisa.’"}
    ],
    action:"Use as frases como inspiração, não como roteiro obrigatório. Diálogo e consentimento precisam ser mútuos."
  },
  {
    num:"04",icon:"☾",title:"Modo Hora H — Mais Presença, Menos Pressão",
    subtitle:"Um roteiro antes, durante e depois da intimidade",
    format:"CHECKLIST POR ETAPAS",eyebrow:"SEM CRONÔMETRO, SEM COMPETIÇÃO",duration:"3 MOMENTOS",
    chapters:[
      {heading:"ANTES · Tire o peso da expectativa",copy:"Cheque se você tem vontade e está confortável. Evite prometer um resultado, duração ou desempenho. Se houver preocupação, considere conversar brevemente antes de começar."},
      {heading:"DURANTE · Atenção ao que é compartilhado",copy:"Observe seu conforto e o da outra pessoa. Se surgirem pensamentos de cobrança, perceba-os e volte a atenção à comunicação e ao momento, sem tentar forçar uma resposta física."},
      {heading:"SE A ANSIEDADE APARECER · Você pode pausar",copy:"Não é preciso insistir. Dê espaço para diálogo, respiração natural e respeito aos limites de ambos. Mudar de ideia é uma opção válida."},
      {heading:"DEPOIS · Sem nota de desempenho",copy:"Evite classificar a experiência como sucesso ou fracasso por um único detalhe. Se fizer sentido, conversem sobre como se sentiram e o que gostariam de ajustar."}
    ],
    action:"A meta é ampliar a percepção e o diálogo, não estabelecer uma performance ideal."
  },
  {
    num:"05",icon:"◈",title:"Entenda Sua Ereção — Corpo, Mente e Ansiedade",
    subtitle:"Mini-aula educativa sobre fatores que podem influenciar a ereção",
    format:"MINI-AULA EM TEXTO",eyebrow:"INFORMAÇÃO SEM MITOS",duration:"5 TÓPICOS",
    chapters:[
      {heading:"01 · A ereção não é apenas ‘força de vontade’",copy:"A ereção envolve processos vasculares, nervosos e hormonais, além do contexto emocional e relacional. Não existe uma explicação única que sirva para todas as pessoas."},
      {heading:"02 · O papel da ansiedade",copy:"Preocupações e vigilância constante do próprio desempenho podem coexistir com dificuldades na intimidade. Isso não significa que todo problema de ereção seja psicológico."},
      {heading:"03 · Rotina e outras influências",copy:"Sono, consumo de álcool, tabagismo, condições de saúde e alguns medicamentos podem influenciar a função sexual. Alterar medicamentos sem orientação profissional não é seguro."},
      {heading:"04 · O que o quiz pode e não pode dizer",copy:"Suas respostas mostram preocupações relatadas, mas não identificam a causa de uma dificuldade de ereção nem determinam um tratamento apropriado."},
      {heading:"05 · Quando buscar avaliação",copy:"Procure médico habilitado se houver dificuldade persistente, mudança súbita, dor ou outros sintomas, ou se a situação afetar seu bem-estar. Um profissional poderá avaliar causas e opções de cuidado."}
    ],
    action:"Material informativo; não constitui diagnóstico, tratamento ou orientação para interromper medicamentos."
  }
];

const FAQ=[
  ["O EIXO promete acabar com a ansiedade sexual?","Não. Este material ajuda a refletir sobre autocobrança e estratégias gerais de bem-estar. Não é tratamento, diagnóstico nem promessa de desempenho."],
  ["O conteúdo do roteiro de 7 dias é realmente gratuito?","Sim. As sete etapas e os cinco materiais complementares estão disponíveis nesta página após a raspadinha, sem pagamento."],
  ["O desconto de 80% já funciona para comprar?","A raspadinha apresenta a campanha Black Friday, mas a oferta paga ainda depende de preço e checkout configurados. Não mostramos um pagamento como ativo antes dessa confirmação."],
  ["Meus dados do questionário são enviados a alguém?","Nesta versão, as respostas e seu nome opcional ficam no estado da página, durante esta navegação. Não são enviados a um servidor nem colocados na URL."],
  ["O EIXO ensina a tratar disfunção erétil ou ejaculação precoce?","Não oferece diagnóstico ou tratamento médico. Dificuldades sexuais têm diferentes causas e podem requerer avaliação de profissional de saúde."],
  ["Posso fazer as práticas se estiver solteiro?","Sim. As atividades tratam de percepção, presença, comunicação e rotina, e podem ser adaptadas à sua realidade."],
  ["E se a dificuldade continuar?","Se existir sofrimento, alteração súbita ou problemas persistentes, converse com um médico ou profissional de saúde mental qualificado."]
];
const TABS=["Início","Roteiro","Práticas","Revisão"] as const;
type Tab=typeof TABS[number];
function selected(answers:(number|null)[],index:number,options:string[]){
  const value=answers[index];
  return typeof value==="number"&&value>=0&&value<options.length?options[value]:"Não informado";
}
function currency(amount:number){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(amount)}
function PhonePreview({name,focus,time}:{name:string;focus:string;time:string}){
  const [tab,setTab]=useState<Tab>("Início");
  return <div className="eixo-phone-area">
    <div className="eixo-phone-shadow"/>
    <div className="eixo-phone">
      <div className="eixo-phone-top"><i/><span>EIXO</span><small>•••</small></div>
      <div className="eixo-phone-greeting"><span>OLÁ, {name||"VOCÊ"}</span><strong>SEU ESPAÇO, SEU RITMO.</strong></div>
      <div className="eixo-phone-nav" role="tablist" aria-label="Prévia visual dos conteúdos">
        {TABS.map(item=><button key={item} type="button" role="tab" aria-selected={tab===item} onClick={()=>setTab(item)} className={tab===item?"active":""}>{item}</button>)}
      </div>
      {tab==="Início"&&<div className="eixo-phone-body"><span>SEU PONTO DE PARTIDA</span><h4>{focus}</h4><div className="eixo-phone-meter"><i/></div><p>Você concluiu a reflexão. Agora escolha uma prática possível para seu dia.</p><div className="eixo-phone-note">✦ Presença antes da cobrança</div></div>}
      {tab==="Roteiro"&&<div className="eixo-phone-body"><span>7 ETAPAS EDUCATIVAS</span>{DAYS.slice(0,4).map(day=><div className="eixo-phone-list" key={day.day}><b>{day.day}</b><span>{day.title}</span><strong>✓</strong></div>)}</div>}
      {tab==="Práticas"&&<div className="eixo-phone-body"><span>SEU TEMPO DISPONÍVEL</span><h4>{time}</h4><p>Práticas de respiração, reflexão e comunicação organizadas para explorar sem pressa.</p><div className="eixo-phone-note">◎ Observe · Respire · Converse</div></div>}
      {tab==="Revisão"&&<div className="eixo-phone-body"><span>REGISTRO PESSOAL</span><h4>O QUE MUDOU NA SUA PERCEPÇÃO?</h4><p>Use seu roteiro para registrar observações. Não há metas de duração ou curvas de resultados inventadas.</p><div className="eixo-phone-note">✓ Seu ritmo importa</div></div>}
      <div className="eixo-phone-bottom"><i/><i/><i/></div>
    </div>
    <div className="eixo-phone-caption">PRÉVIA INTERATIVA DE CONTEÚDOS · NÃO É UM APP INSTALADO</div>
  </div>;
}
function InPageCta({label,href="#eixo-bonus"}:{label:string;href?:string}){
  return <a className="eixo-offer-cta" href={href}>{label}<span aria-hidden="true">↗</span></a>;
}
export default function OfferPage({answers,name,onReset}:OfferProps){
  const cleanName=name.trim().slice(0,40);
  const age=selected(answers,0,ANSWERS.age);
  const concern=selected(answers,3,ANSWERS.concern);
  const focus=selected(answers,16,ANSWERS.focus);
  const time=selected(answers,15,ANSWERS.time);
  const moment=selected(answers,1,ANSWERS.moment);
  const status=selected(answers,12,ANSWERS.relationship);
  const pressure=selected(answers,2,["Nunca","Raramente","Às vezes","Frequentemente"]);
  const stress=selected(answers,9,["Não percebo relação","Um pouco","Moderadamente","Bastante"]);
  const talk=selected(answers,8,["Consigo conversar","Com alguma dificuldade","Quase nunca","Não tenho com quem conversar"]);
  const insights=[
    {active:(answers[2]??0)>=2,title:"Medo antecipatório",text:"Você relatou que a preocupação com falhar aparece em alguns momentos."},
    {active:(answers[9]??0)>=2,title:"Estresse da rotina",text:"O estresse do dia também apareceu na forma como você percebe a intimidade."},
    {active:(answers[8]??0)>=2,title:"Dificuldade de conversar",text:"Falar sobre essas inseguranças pode ser uma parte importante da sua experiência."},
    {active:(answers[13]??0)>=2,title:"Autocobrança",text:"Você percebeu atenção excessiva ao próprio desempenho."},
    {active:(answers[6]??0)>=2,title:"Experiências anteriores",text:"Lembranças de outras situações parecem influenciar suas expectativas."}
  ].filter(item=>item.active).slice(0,3);
  const observations=insights.length?insights:[
    {title:"Um ponto de partida pessoal",text:"Suas respostas indicam quais temas vale explorar com calma, sem transformar isso em diagnóstico."},
    {title:"Olhar para a própria experiência",text:"Seu contexto e suas preferências importam mais que uma meta universal de desempenho."}
  ];
  // Só exibe compra real se ambos os valores forem fornecidos e validados na configuração.
  const checkout=(process.env.NEXT_PUBLIC_EIXO_CHECKOUT_URL||"").trim();
  const basePrice=Number(process.env.NEXT_PUBLIC_EIXO_BASE_PRICE||0);
  const ready=checkout.startsWith("https://")&&Number.isFinite(basePrice)&&basePrice>0;
  const discounted=ready?basePrice*.2:0;
  const primaryHref=ready?checkout:"#eixo-bonus";
  const primaryText=ready?"CONFERIR OFERTA NO CHECKOUT":"DESBLOQUEAR MEUS 5 BÔNUS";
  const bottomText=ready?currency(discounted)+" · CONFERIR OFERTA":"80% OFF · OFERTA EM PREPARAÇÃO";

  const videoSrc=(process.env.NEXT_PUBLIC_EIXO_VIDEO_URL||"").trim();
  return <div className="eixo-offer eixo-reference-offer" id="eixo-oferta-topo">
    <div className="eixo-offer-ribbon"><span>✦</span> ESQUENTA BLACK FRIDAY <b>80% OFF REVELADO</b><span className="eixo-offer-ribbon-note">{ready?"Confira o valor no checkout":"Checkout ainda não configurado"}</span></div>
    <section className="eixo-offer-hero eixo-reference-hero">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <span className="eixo-offer-kicker">SEU PLANO PERSONALIZADO ESTÁ PRONTO</span>
        <h1>{cleanName&&<><em>{cleanName},</em> </>}VOCÊ PODE TER <em>MAIS PRESENÇA E CONFIANÇA</em> NA SUA VIDA SEXUAL.</h1>
        <p>Um plano educativo para homens que desejam compreender a pressão, conversar com mais tranquilidade e cuidar da intimidade — com discrição e no seu ritmo.</p>
        <div className="eixo-reference-price-pill">
          {ready?<><strong>80% OFF</strong><span>De {currency(basePrice)} por <b>{currency(discounted)}</b> no checkout</span></>:<><strong>PLANO LIBERADO</strong><span>7 dias de orientação educativa + 5 materiais para abrir agora</span></>}
        </div>
        <div className="eixo-reference-tags"><span>● Plano pronto</span><span>● 7 dias</span><span>● Sem cadastro</span><span>● Discreto</span></div>
      </div>
    </section>

    <section className="eixo-presentation-video-section eixo-reference-video" aria-label="Apresentação do EIXO">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-hero-video-slot">
          {videoSrc?
            <video src={videoSrc} controls playsInline preload="metadata" aria-label="Vídeo de apresentação do EIXO"/>:
            <div className="eixo-hero-video-placeholder">
              <span className="eixo-reference-scan">EIXO · PRESENÇA E CONFIANÇA</span>
              <div className="eixo-reference-video-ring" aria-hidden="true"><span>7</span><small>DIAS</small></div>
              <strong>ASSISTA À APRESENTAÇÃO</strong>
              <span>VÍDEO VERTICAL 9:16 EM PREPARAÇÃO</span>
            </div>}
        </div>
        <div className="eixo-reference-video-controls"><span aria-hidden="true">▶</span><div className="eixo-reference-video-track"><i/></div><span aria-hidden="true">◖))</span></div>
        <a href="#eixo-perfil" className="eixo-reference-cta">VER MINHA ANÁLISE PERSONALIZADA <span>→</span></a>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-examples" id="eixo-exemplos">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>ENTENDA O QUE VOCÊ PODE ENCONTRAR</span><h2>CONFIANÇA COMEÇA COM <em>CLAREZA.</em></h2><p>Exemplos das reflexões do próprio EIXO. São demonstrações de conteúdo, não depoimentos de clientes.</p></div>
        <div className="eixo-reference-messages">
          {[
            {question:"O QUE A PRESSÃO FAZ COM O MOMENTO?",reply:"Quando fico preocupado em falhar, percebo que paro de prestar atenção ao que sinto.",lesson:"Perceber o pensamento pode ser o primeiro passo para desacelerar."},
            {question:"COMO CONVERSAR SOBRE A INSEGURANÇA?",reply:"Quero falar sobre uma coisa íntima sem precisar fingir que está tudo bem.",lesson:"A comunicação pode ajudar a reduzir o peso de expectativas irreais."},
            {question:"E SE EU NÃO ESTIVER À VONTADE?",reply:"Posso fazer uma pausa, respirar no meu ritmo ou decidir não continuar.",lesson:"Conforto e consentimento importam mais do que cumprir uma meta de tempo."}
          ].map((c,i)=><article className="eixo-reference-message" key={c.question}>
             <div className="eixo-reference-message-head"><span>◉ EIXO</span><small>EXEMPLO EDUCATIVO {String(i+1).padStart(2,"0")}</small></div>
             <div className="eixo-reference-message-question">{c.question}</div>
             <div className="eixo-reference-message-reply">{c.reply}</div>
             <p>{c.lesson}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="eixo-offer-section eixo-profile-section" id="eixo-perfil">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">DIAGNÓSTICO DO SEU PERFIL</span><h2>{cleanName?cleanName+", ":""}VEJA O QUE SUAS <em>RESPOSTAS MOSTRAM.</em></h2><p>Usamos somente as respostas que você forneceu. Não criamos um diagnóstico nem atribuímos automaticamente uma causa física.</p></div>
        <div className="eixo-profile-grid">
          <div className="eixo-profile-table">
            {[
              ["FAIXA ETÁRIA",age],
              ["PRINCIPAL PREOCUPAÇÃO",concern],
              ["QUANDO APARECE",moment],
              ["FREQUÊNCIA DO MEDO",pressure],
              ["ESTRESSE DA ROTINA",stress],
              ["COMUNICAÇÃO",talk],
              ["SITUAÇÃO AFETIVA",status],
              ["TEMPO DISPONÍVEL",time],
              ["O QUE VOCÊ BUSCA",focus]
            ].map(([label,value])=><div className="eixo-profile-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="eixo-profile-side"><span>LEITURA DAS SUAS RESPOSTAS</span><h3>O PROBLEMA NÃO PRECISA SER RESUMIDO A UM NÚMERO.</h3>{observations.map(item=><div className="eixo-observation" key={item.title}><b>✦</b><div><strong>{item.title}</strong><p>{item.text}</p></div></div>)}<small>Leitura descritiva, não clínica. Dificuldades sexuais podem ter causas diferentes.</small></div>
        </div>
        <InPageCta label="ENTENDER O MÉTODO EIXO" href="#eixo-metodo"/>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-understand">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>O SEU PONTO DE PARTIDA</span><h2>O QUE VOCÊ <em>PODE OBSERVAR.</em></h2><p>As respostas não identificam uma causa física nem determinam o que vai acontecer. Elas mostram temas que vale explorar.</p></div>
        <div className="eixo-reference-understand-grid">
          <div className="eixo-reference-concern-card"><span>O QUE VOCÊ RELATOU</span><strong>{concern}</strong><p>Principal preocupação informada no questionário.</p></div>
          <div className="eixo-reference-concern-card"><span>O QUE VOCÊ BUSCA</span><strong>{focus}</strong><p>Uma intenção pessoal, sem prazo de resultado físico.</p></div>
        </div>
        <div className="eixo-reference-path-card">
          <strong>O PROGRESSO DO ROTEIRO EDUCATIVO</strong>
          <svg viewBox="0 0 460 178" role="img" aria-label="Linha ilustrativa das três etapas do roteiro de sete dias: reconhecer, praticar e revisar">
            <defs><linearGradient id="eixo-path-color" x1="0" x2="1"><stop offset="0" stopColor="#c5a458"/><stop offset="1" stopColor="#38b966"/></linearGradient></defs>
            <path d="M35 130H426M35 91H426M35 52H426" stroke="#ffffff18" strokeWidth="1" strokeDasharray="3 5"/>
            <path d="M35 143C104 143 139 111 204 99S335 58 422 43" stroke="url(#eixo-path-color)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {[{x:35,y:143,t:"1"},{x:204,y:99,t:"2"},{x:422,y:43,t:"3"}].map(p=><g key={p.t}><circle cx={p.x} cy={p.y} r="10" fill="#171717" stroke="#d5b36e" strokeWidth="2"/><text x={p.x} y={p.y+3.5} textAnchor="middle" fill="#f9dfa5" fontSize="10">{p.t}</text></g>)}
            <text x="35" y="169" fill="#c8c0b3" fontSize="12">Dia 1</text><text x="192" y="169" fill="#c8c0b3" fontSize="12">Dia 4</text><text x="396" y="169" fill="#56c986" fontSize="12">Dia 7</text>
          </svg>
          <div className="eixo-reference-path-legend"><span>01 Reconhecer</span><span>02 Praticar</span><span>03 Revisar</span></div>
          <small>Sequência de atividades, não previsão de cura ou desempenho.</small>
        </div>
      </div>
    </section>

    <section className="eixo-offer-section eixo-cream" id="eixo-metodo">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">02 / COMO FUNCIONA</span><h2>SAIA DO MODO <em>“E SE EU FALHAR?”</em></h2><p>O roteiro EIXO não mede potência sexual. Ele organiza reflexões possíveis sobre ansiedade, presença, diálogo e rotina.</p></div>
        <div className="eixo-comparison">
          <article><span>QUANDO A COBRANÇA ASSUME</span><h3>VOCÊ TENTA CONTROLAR CADA SEGUNDO.</h3><p>Comparações, antecipações e preocupação constante podem tirar a atenção do momento.</p><div className="eixo-comparison-graphic">MEDO <b>→</b> TENSÃO <b>→</b> MAIS COBRANÇA</div></article>
          <article><span>UM CAMINHO MAIS REALISTA</span><h3>VOCÊ APRENDE A PERCEBER E DESACELERAR.</h3><p>Reconhecer pensamentos, cuidar da comunicação e observar o contexto pode ajudar no autoconhecimento.</p><div className="eixo-comparison-graphic">PERCEBER <b>→</b> RESPIRAR <b>→</b> CONVERSAR</div></article>
        </div>
        <div className="eixo-method-phases">
          {[
            {n:"01",days:"DIAS 1–2",title:"Reconhecer",text:"Perceber gatilhos e reduzir a pressão de ter uma resposta perfeita."},
            {n:"02",days:"DIAS 3–5",title:"Praticar presença",text:"Rever expectativas e explorar comunicação e atenção ao momento."},
            {n:"03",days:"DIAS 6–7",title:"Escolher o próximo passo",text:"Observar rotina e decidir quais estratégias continuar."}
          ].map(p=><article key={p.n}><span>{p.n}</span><div><small>{p.days}</small><h3>{p.title}</h3><p>{p.text}</p></div></article>)}
        </div>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-routine">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>ESTRUTURA EDUCATIVA</span><h2>SUA JORNADA DE <em>PRÁTICA.</em></h2><p>Veja como as etapas se encaixam em uma rotina simples de sete dias.</p></div>
        <div className="eixo-reference-roadmap-card">
          <div className="eixo-reference-roadmap-top"><div><small>ESTRUTURA EDUCATIVA</small><h3>Seu plano em etapas</h3></div><span>◉ 7 dias</span></div>
          <div className="eixo-reference-roadmap-dates"><div><small>INÍCIO</small><strong>Dia 1</strong><span>Reconhecer</span></div><div><small>CONCLUSÃO</small><strong>Dia 7</strong><span>Revisar</span></div></div>
          <div className="eixo-reference-roadmap-timeline">
            {[
              {n:"1",title:"Começar",date:"DIA 1",desc:"Perceber a autocobrança e iniciar sua reflexão."},
              {n:"2",title:"Praticar",date:"DIAS 2 A 5",desc:"Explorar presença, expectativas e comunicação."},
              {n:"3",title:"Revisar",date:"DIAS 6 E 7",desc:"Olhar para sua rotina e definir o próximo passo."}
            ].map((m,i)=><div key={m.n} className="eixo-reference-timeline-row"><b className={i===2?"is-finished":""}>{m.n}</b><div><strong>{m.title}</strong><span>{m.desc}</span></div><small>{m.date}</small></div>)}
          </div>
          <div className="eixo-reference-roadmap-metrics"><div><b>◷</b><small>TEMPO</small><strong>{time}</strong></div><div><b>▣</b><small>ACESSO</small><strong>Navegador</strong></div><div><b>✦</b><small>ROTEIRO</small><strong>7 dias</strong></div></div>
          <p className="eixo-reference-roadmap-discreet">◉ Total discrição: as respostas ficam nesta sessão do navegador, sem exposição pública.</p>
        </div>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-app">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>SEU ESPAÇO EIXO</span><h2>ACOMPANHE SEU ROTEIRO <em>PELO CELULAR.</em></h2><p>Prévia interativa dos materiais disponíveis aqui no navegador. Não exige instalar um aplicativo.</p></div>
        <PhonePreview name={cleanName} focus={focus} time={time}/>
        <InPageCta label="ABRIR OS 7 DIAS" href="#eixo-plano"/>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-contrast">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>ANTES E DEPOIS DA REFLEXÃO</span><h2>NÃO É UMA DISPUTA DE MINUTOS. <em>É UMA MUDANÇA DE FOCO.</em></h2><p>Comparação ilustrativa do modo de pensar, não resultado clínico nem depoimento real.</p></div>
        <div className="eixo-reference-contrast-visual">
          <img src="/images/eixo-antes-depois.avif" alt="Comparação ilustrativa de um homem preocupado e de um casal sorrindo" width={920} height={399} loading="lazy"/>
        </div>
        <div className="eixo-reference-contrast-cards">
          <article><span>ANTES · AUTOCOBRANÇA</span><strong>“E se eu falhar?”</strong><p>Foco excessivo no desempenho e no medo de decepcionar.</p></article>
          <article><span>DEPOIS · PRESENÇA</span><strong>“Posso ir no meu ritmo.”</strong><p>Mais atenção ao conforto, ao diálogo e às próprias necessidades.</p></article>
        </div>
      </div>
    </section>

    <section className="eixo-offer-section eixo-cream" id="eixo-plano">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">04 / ROTEIRO LIBERADO</span><h2>SEU PONTO DE PARTIDA EM <em>7 DIAS.</em></h2><p>São atividades educativas que você pode usar no seu ritmo. Nada aqui garante resultados físicos ou substitui orientação profissional.</p></div>
        <div className="eixo-day-list">{DAYS.map(d=><details key={d.day}><summary><span className="eixo-day-number">{d.day}</span><span><small>{d.tag}</small><strong>{d.title}</strong></span><b>+</b></summary><p>{d.text}</p></details>)}</div>
        <div className="eixo-plan-note"><b>UMA META REALISTA</b><p>Dedicar {time.toLowerCase()} ao autoconhecimento e à atenção ao bem-estar, quando isso fizer sentido para você.</p></div>
        <InPageCta label="VER MEUS BÔNUS GRATUITOS" href="#eixo-bonus"/>
      </div>
    </section>

    <section className="eixo-offer-section" id="eixo-preview">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">03 / POR DENTRO DO EIXO</span><h2>NADA DE PROMESSA VAZIA. <em>VEJA O QUE VOCÊ ACESSA.</em></h2><p>Uma prévia navegável foi apresentada acima. Aqui está o material real que você pode abrir hoje, sem pagamento e sem instalar aplicativo.</p></div>
        <div className="eixo-preview-cards">
          <article><span>01 / SEU PERFIL</span><strong>O QUE SUAS RESPOSTAS REVELARAM</strong><p>Um resumo descritivo do que você indicou sobre pressão e rotina.</p></article>
          <article><span>02 / SEU ROTEIRO</span><strong>SETE DIAS PARA OBSERVAR E PRATICAR</strong><p>Atividades curtas de atenção, comunicação e reflexão.</p></article>
          <article><span>03 / SEUS BÔNUS</span><strong>CINCO MATERIAIS COMPLEMENTARES</strong><p>Guias e checklists com conteúdo disponível nesta página.</p></article>
        </div>
        <InPageCta label="ABRIR MEU ROTEIRO DE 7 DIAS" href="#eixo-plano"/>
      </div>
    </section>

    <section className="eixo-offer-section eixo-bonus-section" id="eixo-bonus">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head">
          <span className="eixo-offer-kicker">05 / CONTEÚDO EXCLUSIVO EIXO</span>
          <h2>MAIS DO QUE BÔNUS. <em>FERRAMENTAS PARA A HORA H.</em></h2>
          <p>Cinco materiais complementares, práticos e com linguagem direta. O conteúdo escrito já está disponível para leitura nesta página, sem cadastro ou pagamento.</p>
        </div>
        <div className="eixo-bonus-grid">
          {BONUSES.map(b=><details key={b.num} className="eixo-bonus-item">
            <summary>
              <div className={"eixo-bonus-cover eixo-bonus-cover-"+b.num} aria-hidden="true">
                <div className="eixo-bonus-cover-top"><span>EIXO</span><span>{b.num}/05</span></div>
                <div className="eixo-bonus-cover-center"><span>{b.icon}</span><strong>{b.eyebrow}</strong></div>
                <div className="eixo-bonus-cover-bottom">{b.format}</div>
              </div>
              <div className="eixo-bonus-head">
                <span>BÔNUS {b.num} · CONTEÚDO DISPONÍVEL</span>
                <h3>{b.title}</h3>
                <p>{b.subtitle}</p>
                <div className="eixo-bonus-meta"><span>{b.format}</span><span>{b.duration}</span></div>
                <span className="eixo-bonus-open">ACESSAR MEU BÔNUS <b>↗</b></span>
              </div>
              <span className="eixo-bonus-free">INCLUÍDO</span>
              <b className="eixo-bonus-plus" aria-hidden="true">+</b>
            </summary>
            <div className="eixo-bonus-content">
              <div className="eixo-bonus-content-header"><span>CONTEÚDO EXCLUSIVO EIXO · {b.num}/05</span><h4>{b.title}</h4><p>{b.subtitle}</p></div>
              <div className="eixo-bonus-chapters">{b.chapters.map((chapter,i)=><div className="eixo-bonus-chapter" key={chapter.heading}><span>{String(i+1).padStart(2,"0")}</span><div><h5>{chapter.heading}</h5><p>{chapter.copy}</p></div></div>)}</div>
              <p className="eixo-bonus-caution">{b.action}</p>
              <div className="eixo-bonus-end">✦ MATERIAL CONCLUÍDO · EIXO</div>
            </div>
          </details>)}
        </div>
        <div className="eixo-all-unlocked">✦ TODOS OS CINCO MATERIAIS ESTÃO DISPONÍVEIS · ABRA OS CARDS PARA ACESSAR</div>
        <p className="eixo-bonus-footnote">Nesta versão, os bônus são materiais digitais escritos. Não anunciamos vídeos, áudios ou aplicativo instalável antes de produzi-los.</p>
      </div>
    </section>

    <section className="eixo-offer-section eixo-cream" id="eixo-confianca">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">06 / TRANSPARÊNCIA</span><h2>CONFIANÇA TAMBÉM É <em>FALAR A VERDADE.</em></h2><p>Você merece entender exatamente o que está recebendo, sem diagnósticos automáticos ou relatos de resultados inventados.</p></div>
        <div className="eixo-trust-grid"><article><b>◈</b><h3>SEM RESULTADOS FALSOS</h3><p>Não mostramos “antes e depois”, percentuais de cura nem depoimentos que não foram verificados.</p></article><article><b>◎</b><h3>SEM PRESSÃO ARTIFICIAL</h3><p>Não usamos contador de urgência fictício ou prazo falso para forçar uma decisão.</p></article><article><b>✓</b><h3>RESPOSTAS DISCRETAS</h3><p>Suas respostas ficam no navegador durante esta experiência e não aparecem em links compartilháveis.</p></article></div>
      </div>
    </section>

    <section className="eixo-offer-section eixo-checkout-section" id="eixo-black-friday">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-sale-card">
          <span className="eixo-offer-kicker">✦ ESQUENTA BLACK FRIDAY EIXO</span>
          <h2>SEU CUPOM REVELOU <em>80% OFF.</em></h2>
          <div className="eixo-sale-percent">80<span>% OFF</span></div>
          {ready?<><p>Oferta promocional preparada para conferência no checkout. O valor mostrado abaixo é calculado a partir do preço-base configurado; confirme condições e desconto no pagamento.</p><div className="eixo-sale-pricing"><span>Preço-base: <s>{currency(basePrice)}</s></span><strong>{currency(discounted)}</strong></div><a href={checkout} target="_blank" rel="noopener noreferrer" className="eixo-offer-cta">CONFERIR VALOR NO CHECKOUT <span>↗</span></a></>:
          <><p>A apresentação da campanha já está pronta, mas ainda não cadastramos um produto pago, preço-base ou checkout. Por isso, não exibimos preço nem botão de compra fictícios.</p><div className="eixo-sale-pending"><b>OFERTA EM PREPARAÇÃO</b><span>Para habilitar a venda, configure o produto, o preço e o checkout real.</span></div><InPageCta label="ABRIR OS BÔNUS JÁ LIBERADOS" href="#eixo-bonus"/></>}
          <small>O desconto da raspadinha não comprova elegibilidade de compra até que haja uma oferta válida configurada. Os cinco materiais educativos acima são gratuitos.</small>
        </div>
      </div>
    </section>

    <section className="eixo-reference-section eixo-reference-access">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <div className="eixo-reference-subheading"><span>ACESSO AOS MATERIAIS</span><h2>O QUE ACONTECE <em>AGORA.</em></h2><p>Seu roteiro e os cinco guias já podem ser abertos. A compra de um produto pago só estará disponível se houver checkout real.</p></div>
        <div className="eixo-reference-access-steps">
          {[{n:"01",icon:"▣",title:"Abra sua página",text:"O resultado já está nesta tela."},{n:"02",icon:"✓",title:"Veja seu roteiro",text:"Sete atividades disponíveis."},{n:"03",icon:"◈",title:"Explore os bônus",text:"Cinco materiais em texto."},{n:"04",icon:"◎",title:"Volte quando quiser",text:"Retome as práticas no seu ritmo."}].map(v=><div key={v.n}><span>{v.icon}</span><strong>{v.title}</strong><small>{v.text}</small></div>)}
        </div>
        <InPageCta label="ABRIR MEUS CINCO BÔNUS" href="#eixo-bonus"/>
      </div>
    </section>

    <section className="eixo-offer-section" id="eixo-faq">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">07 / DÚVIDAS FREQUENTES</span><h2>SEM TABUS. <em>SEM ENROLAÇÃO.</em></h2><p>Respostas diretas sobre privacidade, conteúdo educativo e a campanha Black Friday.</p></div>
        <div className="eixo-faq-list">{FAQ.map(([question,answer],i)=><details key={question}><summary><span>{String(i+1).padStart(2,"0")}</span><strong>{question}</strong><b>+</b></summary><p>{answer}</p></details>)}</div>
      </div>
    </section>

    <section className="eixo-final-section">
      <div className="eixo-offer-wrap">
        <span className="eixo-offer-kicker">EIXO / SUA PRÓXIMA ETAPA</span>
        <h2>A CONFIANÇA COMEÇA <em>QUANDO A COBRANÇA DIMINUI.</em></h2>
        <p>Você já pode explorar o roteiro e os cinco bônus. Não precisa se comparar com ninguém nem atingir um número para começar.</p>
        <InPageCta label="VOLTAR AO MEU ROTEIRO" href="#eixo-plano"/>
        <button type="button" className="eixo-reset" onClick={onReset}>REFAZER AS 18 PERGUNTAS ↺</button>
        <small>Conteúdo educativo · Não substitui avaliação médica ou psicológica.</small>
      </div>
    </section>

    <footer className="eixo-reference-footer">
      <div className="eixo-offer-wrap eixo-reference-narrow">
        <strong>◈ EIXO</strong>
        <p>Conteúdo informativo sobre bem-estar, autocobrança e comunicação. Não substitui avaliação médica ou psicológica.</p>
        <div><a href="#eixo-perfil">Seu perfil</a><a href="#eixo-plano">Roteiro</a><a href="#eixo-faq">Dúvidas frequentes</a></div>
      </div>
    </footer>

    <div className="eixo-offer-sticky">
      <span><strong>{bottomText}</strong><small>{ready?"Valor sujeito a conferência no checkout":"5 materiais gratuitos disponíveis"}</small></span>
      <a href={primaryHref} target={ready?"_blank":undefined} rel={ready?"noopener noreferrer":undefined}>{primaryText} <span>→</span></a>
    </div>
  </div>;
}
