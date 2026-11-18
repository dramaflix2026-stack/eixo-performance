import Link from "next/link";
import "./landing.css";

const CTA = "Criar meu plano personalizado";

function PhoneShowcase() {
  return (
    <div className="eixo-ref-stage" role="img" aria-label="Apresentação ilustrativa do EIXO: um celular preto e dourado mostrando o roteiro educativo de sete dias e o questionário de 18 perguntas">
      <div className="eixo-ref-glow" aria-hidden="true" />
      <div className="eixo-ref-sparks" aria-hidden="true" />

      <div className="eixo-ref-phone" aria-hidden="true">
        <span className="eixo-ref-phone-side" />
        <div className="eixo-ref-phone-bezel">
          <span className="eixo-ref-island" />
          <div className="eixo-ref-screen">
            <div className="eixo-ref-screen-top">
              <strong>EIXO</strong>
              <span>100% DISCRETO</span>
            </div>

            <div className="eixo-ref-disc">
              <div className="eixo-ref-disc-inner">
                <b>07</b>
                <small>dias</small>
              </div>
            </div>

            <div className="eixo-ref-screen-offer">
              <span>CONHEÇA SUA</span>
              <strong>CONFIANÇA</strong>
              <span>SEXUAL</span>
            </div>
            <div className="eixo-ref-screen-small">
              Reflexão personalizada • 18 perguntas
            </div>
            <div className="eixo-ref-screen-button">Criar meu plano <span>➜</span></div>
          </div>
        </div>
      </div>

      <div className="eixo-ref-float eixo-ref-float-left" aria-hidden="true">
        <strong>18</strong>
        <small>perguntas<br/>objetivas</small>
      </div>
      <div className="eixo-ref-float eixo-ref-float-right" aria-hidden="true">
        <strong>07</strong>
        <small>dias de<br/>roteiro</small>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="eixo-ref-page">
      <div className="eixo-ref-panel">
        <div className="eixo-ref-trust">
          <strong>CONFIANÇA COMEÇA NA MENTE · EIXO</strong>
          <div className="eixo-ref-trust-meta" aria-label="Questionário gratuito e discreto">
            <span>🔒</span>
            <span>18 PERGUNTAS</span>
            <span>SEM CADASTRO</span>
          </div>
        </div>

        <h1 className="eixo-ref-headline">
          Aumente sua confiança sexual, entenda a ejaculação precoce e lide melhor com a pressão na cama
          {" "}<em>COMECE COM O EIXO</em>
        </h1>

        <p className="eixo-ref-subheading">Iremos personalizar um plano exclusivo para você!</p>

        <PhoneShowcase />

        <Link href="/quiz" className="eixo-ref-cta" aria-label="Criar meu plano personalizado, começar o questionário">
          {CTA} <span aria-hidden="true">→</span>
        </Link>
        <p className="eixo-ref-discreet"><span aria-hidden="true">🔒</span> Questionário gratuito • Sem cadastro para começar</p>

        <footer className="eixo-ref-footer">
          EIXO · Conteúdo educativo. Não substitui diagnóstico ou tratamento médico.
        </footer>
      </div>
    </main>
  );
}
