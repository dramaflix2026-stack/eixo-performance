import Link from "next/link";

function PhonePreview(){
 return <div className="eixo-visual" aria-label="Prévia visual do questionário EIXO">
  <div className="eixo-halo" aria-hidden="true"/><div className="eixo-orbit eixo-orbit-one" aria-hidden="true"/><div className="eixo-orbit eixo-orbit-two" aria-hidden="true"/><div className="eixo-spark eixo-spark-one" aria-hidden="true">✦</div><div className="eixo-spark eixo-spark-two" aria-hidden="true">✧</div>
  <div className="eixo-phone">
   <div className="eixo-phone-top"><span>9:41</span><span className="eixo-island"/><span>•••</span></div>
   <div className="eixo-phone-screen">
    <div className="eixo-phone-mark"><span>◉</span> EIXO <small>REFLEXÃO GUIADA</small></div>
    <div className="eixo-phone-progress"><span>PASSO 01 DE 07</span><span>14%</span></div>
    <div className="eixo-phone-track"><i/></div>
    <div className="eixo-phone-question">A pressão está tomando o espaço da sua confiança?</div>
    <p>Um passo de cada vez. No seu ritmo.</p>
    <div className="eixo-phone-choice">Raramente <b>○</b></div>
    <div className="eixo-phone-choice active">Às vezes <b>●</b></div>
    <div className="eixo-phone-choice">Frequentemente <b>○</b></div>
    <span className="eixo-phone-foot">PRIVADO • EDUCATIVO • SEM JULGAMENTOS</span>
   </div>
   <div className="eixo-home-bar"/>
  </div>
  <div className="eixo-floating-pill">✦ Clareza antes da cobrança</div><div className="eixo-floating-pill eixo-floating-pill-second"><span className="eixo-pulse-dot"/> Sua jornada começa aqui</div>
 </div>;
}

export default function Home(){
 return <div className="eixo-site">
  <header className="eixo-site-header"><div className="eixo-container eixo-nav">
   <Link className="eixo-wordmark" href="/" aria-label="EIXO, página inicial"><span className="eixo-symbol"><i/></span><span>EIXO</span></Link>
   <nav aria-label="Navegação principal"><a href="#sobre">Sobre</a><a href="#perguntas">Perguntas</a></nav>
   <Link href="/quiz" className="eixo-nav-cta">Começar <span aria-hidden="true">↗</span></Link>
  </div></header>
  <main>
   <section className="eixo-hero"><div className="eixo-container eixo-hero-grid">
    <div className="eixo-copy">
     <span className="eixo-eyebrow"><span className="eixo-eyebrow-dot"/> UM ESPAÇO PARA RETOMAR SUA CONFIANÇA</span>
     <h1>Menos <span className="eixo-accent">pressão.</span><br/>Mais <em>presença.</em><br/>Mais <span className="eixo-text-glow">confiança.</span></h1>
     <p>Quando a ansiedade transforma a intimidade em um teste, entender o que você sente pode ser o primeiro passo. Comece com uma reflexão guiada, discreta e sem julgamentos.</p>
     <div className="eixo-actions"><Link className="eixo-primary" href="/quiz">Iniciar meu questionário <span aria-hidden="true">→</span></Link><a className="eixo-secondary" href="#sobre">Como funciona <span aria-hidden="true">↗</span></a></div>
     <div className="eixo-trust"><span className="eixo-trust-icon">✓</span><span>Gratuito para começar · 7 perguntas · Sem cadastro</span></div>
    </div>
    <PhonePreview/>
   </div></section>
   <section className="eixo-bento-section" id="sobre">
    <div className="eixo-container">
      <div className="eixo-bento-heading">
        <span className="eixo-section-label"><span className="eixo-bento-label-dot"/> SOBRE O EIXO</span>
        <h2>A confiança começa quando<br/><span>a pressão perde espaço.</span></h2>
        <p>Uma experiência discreta e acolhedora para olhar para o estresse e a ansiedade de desempenho de outra maneira.</p>
      </div>
      <div className="eixo-bento-grid">
        <article className="eixo-bento-card eixo-bento-primary">
          <div className="eixo-bento-art" aria-hidden="true">
            <div className="eixo-mind-rings"><i/><i/><i/><i/><span className="eixo-mind-core">✦</span></div>
            <span className="eixo-art-caption">MENOS RUÍDO · MAIS CLAREZA</span>
          </div>
          <div className="eixo-bento-card-content">
            <span className="eixo-bento-number">01 / CONSCIÊNCIA</span>
            <h3>Entenda a pressão.<br/>Retome seu centro.</h3>
            <p>Observe como expectativas e pensamentos antecipatórios podem influenciar sua confiança nos momentos íntimos.</p>
          </div>
        </article>
        <article className="eixo-bento-card eixo-bento-privacy">
          <div className="eixo-privacy-art" aria-hidden="true">
            <div className="eixo-privacy-shield"><svg viewBox="0 0 96 110" fill="none"><path d="M48 5 87 20v29c0 27-17 43-39 55C26 92 9 76 9 49V20L48 5Z" stroke="currentColor" strokeWidth="3"/><path d="m29 55 13 13 26-29" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <span className="eixo-privacy-stamp">AMBIENTE DISCRETO</span>
          </div>
          <div className="eixo-bento-card-content">
            <span className="eixo-bento-number">02 / PRIVACIDADE</span>
            <h3>Seu espaço.<br/>No seu ritmo.</h3>
            <p>Comece sem cadastro e sem compartilhar suas respostas com um servidor.</p>
          </div>
        </article>
        <article className="eixo-bento-card eixo-bento-progress">
          <div className="eixo-progress-art" aria-hidden="true">
            <span className="eixo-mini-label">REFLEXÃO GUIADA</span>
            <strong>07<span> etapas</span></strong>
            <div className="eixo-progress-bars">{[1,2,3,4,5,6,7].map((n)=><i key={n} className={n<3?"active":""}/>)}</div>
            <div className="eixo-progress-orbit"><span>01</span><small>07</small></div>
          </div>
          <div className="eixo-bento-card-content">
            <span className="eixo-bento-number">03 / SIMPLICIDADE</span>
            <h3>Um passo<br/>de cada vez.</h3>
            <p>Sete perguntas objetivas, sem respostas certas ou erradas e sem diagnósticos automáticos.</p>
          </div>
        </article>
      </div>
      <div className="eixo-bento-bottom">
        <span><i className="eixo-bento-check">✓</i> Gratuito para começar. Sem julgamentos.</span>
        <Link href="/quiz" className="eixo-bento-cta">Começar minha reflexão <span aria-hidden="true">→</span></Link>
      </div>
    </div>
   </section>
   <section className="eixo-faq" id="perguntas"><div className="eixo-container eixo-faq-inner">
    <span className="eixo-section-label">PERGUNTAS FREQUENTES</span><h2>Antes de começar</h2>
    <details><summary>O questionário é gratuito?<span>+</span></summary><p>Sim. Você pode responder às sete perguntas sem cadastro e sem pagamento.</p></details>
    <details><summary>O resultado é um diagnóstico?<span>+</span></summary><p>Não. É uma reflexão educativa, que não substitui avaliação médica ou psicológica.</p></details>
    <details><summary>Minhas respostas serão armazenadas?<span>+</span></summary><p>Nesta versão, as respostas são processadas apenas na página e não são enviadas ao servidor.</p></details>
    <details><summary>E se eu sentir dificuldades persistentes?<span>+</span></summary><p>Ansiedade e dificuldades sexuais podem ter diferentes causas. Um profissional de saúde habilitado pode ajudar a investigar e orientar os próximos passos.</p></details>
   </div></section>
  </main>
  <footer className="eixo-site-footer"><div className="eixo-container eixo-footer-content"><Link className="eixo-wordmark" href="/"><span className="eixo-symbol"><i/></span><span>EIXO</span></Link><span className="eixo-footer-tagline">Confiança começa na mente.</span><span>Conteúdo educativo, não substitui orientação profissional.</span></div></footer>
 </div>;
}