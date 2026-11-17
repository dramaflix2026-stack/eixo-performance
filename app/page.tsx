import Link from "next/link";

const faqs = [
  ["O questionário é gratuito?","Sim. Você pode responder às sete perguntas sem pagamento nem cadastro."],
  ["É uma avaliação médica ou psicológica?","Não. O questionário é educativo e não fornece diagnóstico. Se as dificuldades forem persistentes, procure um profissional habilitado."],
  ["Minhas respostas ficam armazenadas?","Não nesta versão. As respostas permanecem na página durante o preenchimento e não são enviadas a um servidor."],
  ["E se a ansiedade estiver afetando minha relação?","Conversar abertamente e buscar orientação de um profissional de saúde pode ajudar a compreender as possíveis causas e as opções de cuidado."]
];
function Brand(){return <Link href="/" className="mx-brand" aria-label="EIXO, início"><span className="mx-brand-symbol">E<span>✕</span></span><strong>EIXO</strong><small>PERFORMANCE MENTAL</small></Link>}
export default function Home(){
 return <div className="mx-site">
  <header className="mx-header"><div className="mx-wrap mx-header-inner"><Brand/><nav aria-label="Navegação principal"><a href="#metodo">O EIXO</a><a href="#perguntas">Perguntas</a></nav><Link className="mx-top-cta" href="/quiz">INICIAR AGORA <span>↗</span></Link></div></header>
  <main>
   <section className="mx-hero">
    <div className="mx-wrap mx-hero-inner">
     <div className="mx-hero-copy">
      <div className="mx-eyebrow"><span/> MENTE FORTE. MENOS COBRANÇA.</div>
      <h1>O MAIOR PESO<br/>NÃO ESTÁ NO<br/><em>SEU CORPO.</em><br/><span>ESTÁ NA PRESSÃO.</span></h1>
      <p>Medo de falhar. Pensamentos acelerados. A sensação de precisar provar alguma coisa. Entenda como a ansiedade pode afetar seus momentos íntimos — e dê o primeiro passo para lidar melhor com ela.</p>
      <div className="mx-hero-actions"><Link className="mx-button mx-button-primary" href="/quiz">DESCOBRIR COMO A PRESSÃO ME AFETA <span>↗</span></Link></div>
      <div className="mx-hero-proof"><span>01 / DISCRETO</span><span>02 / 7 PERGUNTAS</span><span>03 / SEM CADASTRO</span></div>
     </div>
     <div className="mx-hero-photo" aria-label="Retrato masculino editorial"><picture className="mx-photo-picture"><img src="/images/hero.jpg" alt="Homem adulto em retrato editorial de iluminação dramática" loading="eager" fetchPriority="high"/></picture>
      <div className="mx-photo-caption">CONFIANÇA<br/><strong>COMEÇA NA MENTE.</strong></div>
      <span className="mx-vertical-caption">EIXO · CONSCIÊNCIA · EQUILÍBRIO · PRESENÇA</span>
     </div>
    </div>
    <div className="mx-bottom-rule"><div className="mx-wrap"><span>PERFORMANCE NÃO É SOBRE PROVAR. É SOBRE ESTAR PRESENTE.</span><a href="#metodo">CONHEÇA O EIXO ↓</a></div></div>
   </section>
   <section id="metodo" className="mx-method">
    <div className="mx-wrap">
     <div className="mx-method-head"><div><span className="mx-overline">POR QUE O EIXO EXISTE</span><h2>QUANDO A MENTE<br/>COBRA DEMAIS,<br/><em>O MOMENTO MUDA.</em></h2></div><p>A autocobrança pode transformar a intimidade em uma avaliação constante. O primeiro passo não é fingir que a pressão não existe — é reconhecer como ela aparece para você.</p></div>
     <div className="mx-steps">
      <article><div className="mx-step-top"><span>01</span><b>↗</b></div><div className="mx-step-graphic mx-graphic-one"><img className="mx-card-photo" src="/images/pressao.jpg" alt="Homem pensativo em ambiente escuro" loading="lazy"/></div><div className="mx-step-foot"><h3>PRESSÃO</h3><h4>RECONHEÇA O CICLO</h4><p>Observe expectativas, pensamentos antecipatórios e medo de falhar.</p></div></article>
      <article><div className="mx-step-top"><span>02</span><b>↗</b></div><div className="mx-step-graphic mx-graphic-two"><img className="mx-card-photo" src="/images/clareza.jpg" alt="Retrato masculino em preto e branco" loading="lazy"/></div><div className="mx-step-foot"><h3>CLAREZA</h3><h4>ENTENDA SEUS PADRÕES</h4><p>Responda às sete perguntas no seu ritmo, sem julgamento.</p></div></article>
      <article><div className="mx-step-top"><span>03</span><b>↗</b></div><div className="mx-step-graphic mx-graphic-three"><img className="mx-card-photo" src="/images/partida.jpg" alt="Homem com expressão determinada em retrato editorial" loading="lazy"/></div><div className="mx-step-foot"><h3>PONTO DE PARTIDA</h3><h4>COMECE COM CONSCIÊNCIA</h4><p>Receba uma reflexão educativa baseada nas suas respostas.</p></div></article>
     </div>
     <div className="mx-method-cta"><span>SEM CADASTRO. SEM EXPOSIÇÃO. SEM PROMESSAS MILAGROSAS.</span><Link className="mx-button mx-button-dark" href="/quiz">FAZER MINHA REFLEXÃO <span>↗</span></Link></div>
    </div>
   </section>
   <section className="mx-manifesto"><div className="mx-wrap mx-manifesto-inner"><span>EIXO / MANIFESTO</span><h2>VOCÊ NÃO PRECISA<br/><em>PROVAR NADA.</em></h2><p>A intimidade não precisa ser um teste. Comece entendendo o que a pressão provoca em você.</p><Link className="mx-button mx-button-primary mx-manifesto-cta" href="/quiz">COMEÇAR QUESTIONÁRIO <span aria-hidden="true">↗</span></Link><small>7 perguntas · Sem cadastro · Questionário educativo</small></div></section>
   <section className="mx-faq" id="perguntas"><div className="mx-wrap mx-faq-grid"><div><span className="mx-overline">DÚVIDAS FREQUENTES</span><h2>SEM TABUS.<br/><em>SEM ENROLAÇÃO.</em></h2><p>As informações abaixo ajudam você a entender o propósito dessa experiência.</p></div><div className="mx-faq-items">{faqs.map(([question,answer],i)=><details key={question}><summary><span>{String(i+1).padStart(2,"0")}</span>{question}<b>+</b></summary><p>{answer}</p></details>)}</div></div></section>
  </main>
  <footer className="mx-footer"><div className="mx-wrap"><Brand/><p>EIXO — Confiança começa na mente.</p><small>Conteúdo educativo. Não substitui aconselhamento médico ou psicológico.</small><Link href="/quiz">INICIAR QUESTIONÁRIO ↗</Link></div></footer>
 </div>;
}