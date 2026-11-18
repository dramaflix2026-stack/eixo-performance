import Link from "next/link";
import "./landing.css";

const trustItems = [
  { icon: "shield", title: "100% discreto" },
  { icon: "user", title: "Sem cadastro" },
  { icon: "flash", title: "Questionário rápido" },
  { icon: "layers", title: "Plano personalizado" },
] as const;

function TrustIcon({ icon }: { icon: (typeof trustItems)[number]["icon"] }) {
  if (icon === "shield") return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 3 31 8v11c0 8-5 12-13 15C10 31 5 27 5 19V8L18 3Z" stroke="currentColor" strokeWidth="2.4"/><path d="m12 18 4 4 9-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (icon === "user") return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM5 33c0-6 5.8-10.5 13-10.5S31 27 31 33" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M10 15H3M6.5 11.5v7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/></svg>;
  if (icon === "flash") return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M20 2 6 20h11l-1 14 15-20H20V2Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round"/></svg>;
  return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="m18 2 15 8-15 8L3 10 18 2Zm15 16-15 8L3 18m30 8-15 8-15-8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function Home() {
  return (
    <main className="eixo-hero-landing">
      <div className="eixo-hero-accent eixo-hero-accent-top" aria-hidden="true" />
      <div className="eixo-hero-accent eixo-hero-accent-bottom" aria-hidden="true" />

      <section className="eixo-hero-inner" aria-labelledby="eixo-hero-heading">
        <div className="eixo-hero-logo" aria-label="EIXO">
          EI<span>X</span>O
        </div>

        <div className="eixo-hero-trust-top">
          <strong>EIXO · CONFIANÇA COMEÇA NA MENTE</strong>
          <span>QUESTIONÁRIO GRATUITO <i>✦</i> PRIVADO <i>✦</i> PERSONALIZADO</span>
        </div>

        <h1 id="eixo-hero-heading" className="eixo-hero-heading">
          Sua esposa merece mais<br className="eixo-hero-desktop-break" /> do que 2 minutos.
          <em>E você sabe disso</em>
        </h1>

        <p className="eixo-hero-description">
          Vamos criar um plano exclusivo para você <strong>recuperar a confiança, retomar o controle</strong> e viver a intimidade com menos pressão.
        </p>

        <div className="eixo-hero-compare">
          <img
            src="/images/eixo-antes-depois.avif"
            alt="Comparação ilustrativa: à esquerda um homem preocupado sentado na cama; à direita um casal sorrindo e abraçado na cama"
            width={920}
            height={399}
            fetchPriority="high"
          />
        </div>

        <Link href="/quiz" className="eixo-hero-button" aria-label="Fazer meu diagnóstico agora. Iniciar o questionário educativo">
          Fazer meu diagnóstico agora
          <span aria-hidden="true">→</span>
        </Link>

        <div className="eixo-hero-trust-row" aria-label="Benefícios e privacidade do questionário">
          {trustItems.map((item) => (
            <div className="eixo-hero-trust-item" key={item.icon}>
              <TrustIcon icon={item.icon} />
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        <p className="eixo-hero-disclaimer">
          Questionário informativo. Não é um diagnóstico médico e não promete resultados específicos.
        </p>
      </section>
    </main>
  );
}
