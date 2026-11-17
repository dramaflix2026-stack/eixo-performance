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
   <section className="eixo-about" id="sobre"><div className="eixo-container eixo-about-grid">
    <div><span className="eixo-section-label">SOBRE O EIXO</span><h2>O momento íntimo não precisa ser uma prova.</h2></div>
    <div><p>A pressão pelo desempenho pode fazer com que a atenção se afaste da conexão e se concentre no medo de falhar. O EIXO propõe um ponto de partida educativo para perceber esses padrões.</p><div className="eixo-benefit-list"><div><span>01</span><strong>Discreto</strong><small>Sem exposição pessoal</small></div><div><span>02</span><strong>Rápido</strong><small>7 perguntas objetivas</small></div><div><span>03</span><strong>Sem julgamentos</strong><small>No seu ritmo</small></div></div><Link href="/quiz" className="eixo-inline-link">Começar minha reflexão <span>→</span></Link></div>
   </div></section>
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