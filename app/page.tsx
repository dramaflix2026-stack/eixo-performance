import Link from "next/link";
import "./landing.css";

export default function Home() {
  return (
    <main className="eixoh-page">
      <div className="eixoh-canvas">
        <section className="eixoh-intro" aria-labelledby="eixoh-title">
          <div className="eixoh-trust">
            <strong>✦ CRIADO PARA HOMENS QUE QUEREM MAIS CONFIANÇA</strong>
            <span>🔒 Questionário gratuito · Sem cadastro</span>
          </div>

          <h1 id="eixoh-title" className="eixoh-heading">
            Aumente sua confiança sexual, entenda a ejaculação precoce e aprenda a lidar com a pressão na cama{" "}<em>COM O EIXO.</em>
          </h1>
          <p className="eixoh-description">
            Iremos personalizar um plano exclusivo para você!
          </p>
        </section>

        <div
          className="eixoh-showcase"
          role="img"
          aria-label="Ilustração original de celular do EIXO, com 18 perguntas sobre ansiedade e confiança na hora do sexo"
        >
          <span className="eixoh-floating eixoh-floating-left" aria-hidden="true">
            <strong>18</strong><small>perguntas<br/>para seu perfil</small>
          </span>
          <span className="eixoh-floating eixoh-floating-right" aria-hidden="true">
            <strong>SEU PERFIL</strong><small>confidencial<br/>e gratuito</small>
          </span>

          <div className="eixoh-device" aria-hidden="true">
            <div className="eixoh-device-notch"/>
            <div className="eixoh-device-screen">
              <div className="eixoh-device-brand">EIXO</div>
              <span className="eixoh-device-badge">100% DISCRETO</span>
              <div className="eixoh-device-ring">
                <div className="eixoh-device-ring-inner">
                  <strong>18</strong>
                  <span>PERGUNTAS</span>
                </div>
              </div>
              <strong className="eixoh-device-statement">
                AUMENTE SUA <em>CONFIANÇA</em> SEXUAL
              </strong>
              <span className="eixoh-device-text">Plano personalizado · Sem pílulas · Comece gratuitamente</span>
              <div className="eixoh-device-button">CRIAR MEU PLANO →</div>
              <span className="eixoh-device-home"/>
            </div>
          </div>
        </div>

        <Link className="eixoh-primary" href="/quiz">
          Criar meu plano personalizado <span aria-hidden="true">→</span>
        </Link>
        <p className="eixoh-safe-note">
          🔒 Questionário gratuito · Sem cadastro para começar
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
