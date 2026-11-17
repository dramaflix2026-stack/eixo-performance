"use client";

import { useState } from "react";
import "./offer.css";

type OfferProps={answers:(number|null)[];name:string;onReset:()=>void};
type Bonus={num:string;icon:string;title:string;subtitle:string;detail:string[]};
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
  {num:"01",icon:"✦",title:"Guia para conversar sem vergonha",subtitle:"3 maneiras simples de abrir um diálogo",detail:["Queria falar sobre algo que às vezes me deixa inseguro na intimidade. Você pode me ouvir?","Eu me sinto mais tranquilo quando a gente não coloca pressão sobre o que deve acontecer.","O que faz você se sentir à vontade? Quero entender isso melhor também."]},
  {num:"02",icon:"◎",title:"Ritual de presença",subtitle:"Uma pausa educativa antes da hora H",detail:["Sente-se confortavelmente e perceba os pés apoiados no chão.","Observe sua respiração sem tentar alcançar um desempenho específico.","Repare em três sensações do corpo e volte sua atenção ao ambiente."]},
  {num:"03",icon:"◈",title:"Checklist da autocobrança",subtitle:"5 perguntas para reconhecer gatilhos",detail:["Estou me cobrando por uma duração ou resultado específico?","Estou antecipando algo que ainda nem aconteceu?","O estresse do dia está influenciando meus pensamentos?","Estou deixando de lado o conforto e a comunicação?","O que eu diria a alguém que estivesse sentindo o mesmo?"]},
  {num:"04",icon:"☾",title:"Roteiro para uma noite sem cobrança",subtitle:"Conforto, conversa e mais presença",detail:["Comece sem definir uma meta de desempenho.","Dê espaço para diálogo, consentimento e conforto mútuo.","Se a ansiedade surgir, respeite seus limites e desacelere."]},
  {num:"05",icon:"✓",title:"Mapa de hábitos da semana",subtitle:"Acompanhe o que faz sentido repetir",detail:["Registre situações que geraram pressão e o que ajudou a lidar com elas.","Observe sono, cansaço e outros aspectos da rotina.","Ao fim da semana, escolha uma prática possível para continuar."]}
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
  const lead=[cleanName?cleanName+", ":"","sua próxima experiência íntima não precisa começar com medo."].join("");
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

  return <div className="eixo-offer" id="eixo-oferta-topo">
    <div className="eixo-offer-ribbon"><span>✦</span> ESQUENTA BLACK FRIDAY <b>80% OFF REVELADO</b><span className="eixo-offer-ribbon-note">{ready?"Confira o preço no checkout":"Pagamento ainda não habilitado"}</span></div>
    <section className="eixo-offer-hero">
      <div className="eixo-offer-wrap eixo-hero-grid">
        <div className="eixo-hero-copy">
          <span className="eixo-offer-kicker">SEU RESULTADO ESTÁ PRONTO · EIXO</span>
          <h1>{lead.split(" ").slice(0,cleanName?1:0).join(" ")}{cleanName&&<>{cleanName}, </>}<em>SUA VIDA SEXUAL</em> PODE TER MENOS PRESSÃO.</h1>
          <p>Você chegou até aqui para entender o que está atrapalhando sua confiança na hora de transar. Agora tem um ponto de partida baseado no que respondeu — sem promessas milagrosas.</p>
          <div className="eixo-hero-facts"><span>✓ 18 RESPOSTAS CONSIDERADAS</span><span>✓ CONTEÚDO DISCRETO</span><span>✓ SEM DIAGNÓSTICO INVENTADO</span></div>
          <InPageCta label="VER MEU PONTO DE PARTIDA" href="#eixo-perfil"/>
          <small>O roteiro educativo e os cinco materiais complementares estão disponíveis nesta página.</small>
        </div>
        <div className="eixo-hero-visual"><PhonePreview name={cleanName} focus={focus} time={time}/></div>
      </div>
    </section>

    <section className="eixo-offer-section eixo-profile-section" id="eixo-perfil">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">01 / SEU PERFIL</span><h2>ANTES DE MUDAR ALGUMA COISA, <em>ENTENDA O QUE VOCÊ SENTE.</em></h2><p>Usamos somente as respostas que você forneceu. Não criamos um diagnóstico nem atribuímos automaticamente uma causa física.</p></div>
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

    <section className="eixo-offer-section eixo-cream" id="eixo-plano">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">04 / ROTEIRO LIBERADO</span><h2>SEU PONTO DE PARTIDA EM <em>7 DIAS.</em></h2><p>São atividades educativas que você pode usar no seu ritmo. Nada aqui garante resultados físicos ou substitui orientação profissional.</p></div>
        <div className="eixo-day-list">{DAYS.map(d=><details key={d.day}><summary><span className="eixo-day-number">{d.day}</span><span><small>{d.tag}</small><strong>{d.title}</strong></span><b>+</b></summary><p>{d.text}</p></details>)}</div>
        <div className="eixo-plan-note"><b>UMA META REALISTA</b><p>Dedicar {time.toLowerCase()} ao autoconhecimento e à atenção ao bem-estar, quando isso fizer sentido para você.</p></div>
        <InPageCta label="VER MEUS BÔNUS GRATUITOS" href="#eixo-bonus"/>
      </div>
    </section>

    <section className="eixo-offer-section" id="eixo-bonus">
      <div className="eixo-offer-wrap eixo-column">
        <div className="eixo-section-head"><span className="eixo-offer-kicker">05 / BÔNUS REAIS</span><h2>VOCÊ GANHOU <em>5 CONTEÚDOS EXTRAS.</em></h2><p>São materiais gratuitos que existem nesta própria página. Abra cada cartão para acessar as orientações — sem preços riscados fictícios.</p></div>
        <div className="eixo-bonus-grid">{BONUSES.map(b=><details key={b.num} className="eixo-bonus-item"><summary><div className="eixo-bonus-icon">{b.icon}</div><div className="eixo-bonus-head"><span>BÔNUS {b.num} · LIBERADO</span><h3>{b.title}</h3><p>{b.subtitle}</p></div><span className="eixo-bonus-free">GRÁTIS</span><b className="eixo-bonus-plus">+</b></summary><div className="eixo-bonus-detail">{b.detail.map((line,i)=><p key={line}><span>{String(i+1).padStart(2,"0")}</span>{line}</p>)}</div></details>)}</div>
        <div className="eixo-all-unlocked">✦ TODOS OS CINCO MATERIAIS PODEM SER ABERTOS AGORA</div>
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

    <div className="eixo-offer-sticky"><span><strong>{bottomText}</strong><small>{ready?"Pagamento em site externo":"Bônus gratuitos disponíveis"}</small></span><a href={primaryHref} target={ready?"_blank":undefined} rel={ready?"noopener noreferrer":undefined}>{primaryText} <span>↗</span></a></div>
  </div>;
}
