import Link from "next/link";
import "./landing.css";

export default function Home() {
  return (
    <main className="eixoh-page">
      <div className="eixoh-canvas">
        <section className="eixoh-intro" aria-labelledby="eixoh-title">
          <div className="eixoh-trust">
            <strong>✦ QUESTIONÁRIO GRATUITO E DISCRETO</strong>
            <span>18 perguntas · Sem cadastro para começar</span>
          </div>

          <h1 id="eixoh-title" className="eixoh-heading">
            Medo de brochar, de não durar ou de decepcionar?
            {" "}<em>Entenda a pressão na hora H.</em>
          </h1>
          <p className="eixoh-description">
            Vamos organizar uma reflexão personalizada sobre a sua confiança
            na hora de transar. Comece respondendo a algumas perguntas.
          </p>
        </section>

        <div
          className="eixoh-showcase"
          role="img"
          aria-label="Ilustração original de celular do EIXO, com 18 perguntas sobre ansiedade e confiança na hora do sexo"
        >
          <span className="eixoh-floating eixoh-floating-left" aria-hidden="true">
            <strong>18</strong><small>perguntas<br/>objetivas</small>
          </span>
          <span className="eixoh-floating eixoh-floating-right" aria-hidden="true">
            <strong>DISCRETO</strong><small>sem cadastro<br/>para começar</small>
          </span>

          <div className="eixoh-device" aria-hidden="true">
            <div className="eixoh-device-notch"/>
            <div className="eixoh-device-screen">
              <div className="eixoh-device-brand">EIXO</div>
              <span className="eixoh-device-badge">PERFORMANCE MENTAL</span>
              <div className="eixoh-device-ring">
                <div className="eixoh-device-ring-inner">
                  <strong>18</strong>
                  <span>PERGUNTAS</span>
                </div>
              </div>
              <strong className="eixoh-device-statement">
                CONFIANÇA COMEÇA NA <em>MENTE.</em>
              </strong>
              <span className="eixoh-device-text">Reflexão individual · Sem promessas milagrosas</span>
              <div className="eixoh-device-button">DESCUBRA SEU PONTO DE PARTIDA ↗</div>
              <span className="eixoh-device-home"/>
            </div>
          </div>
        </div>

        <Link className="eixoh-primary" href="/quiz">
          Criar meu plano personalizado <span aria-hidden="true">→</span>
        </Link>
        <p className="eixoh-safe-note">
          🔒 Questionário gratuito · Respostas mantidas nesta página
        </p>
        <footer className="eixoh-footer">
          EIXO — Confiança começa na mente.
          <br/>
          Conteúdo educativo. Não substitui avaliação médica ou psicológica.
        </footer>
      </div>
    </main>
  );
}
