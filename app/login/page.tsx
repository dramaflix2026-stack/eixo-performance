import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";
import "./login.css";

export const metadata: Metadata = {
  title: "Entrar | Método EIXO",
  description: "Acesse sua área exclusiva do Método EIXO com segurança.",
  robots: { index: false, follow: false }
};

function LockMark({size=18}:{size?:number}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor"/></svg>;
}

export default function LoginPage(){
  return <main className="eixo-login-page">
    <div className="eixo-login-glow eixo-login-glow-a" aria-hidden="true"/>
    <div className="eixo-login-glow eixo-login-glow-b" aria-hidden="true"/>

    <header className="eixo-login-header">
      <Link href="/" className="eixo-login-logo" aria-label="EIXO — Página inicial">
        EI<span>X</span>O<span className="eixo-login-logo-dot">.</span>
      </Link>
      <span className="eixo-login-header-caption"><LockMark size={15}/> PORTAL PRIVADO</span>
    </header>

    <div className="eixo-login-layout">
      <section className="eixo-login-editorial" aria-labelledby="eixo-login-presentation">
        <span className="eixo-login-eyebrow"><span className="eixo-login-sparkle">✦</span> ÁREA EXCLUSIVA · MÉTODO EIXO</span>
        <h1 id="eixo-login-presentation">Seu próximo passo começa <em>aqui.</em></h1>
        <p className="eixo-login-lead">Um espaço reservado para você explorar o Método EIXO, acompanhar sua jornada e acessar seus materiais com privacidade.</p>

        <div className="eixo-login-journey" aria-label="Jornada do Método EIXO">
          <div className="eixo-login-journey-top">
            <div className="eixo-login-journey-icon" aria-hidden="true">◈</div>
            <div><span>SEU ESPAÇO</span><strong>Método EIXO</strong></div>
            <span className="eixo-login-journey-status">PRIVADO</span>
          </div>
          <div className="eixo-login-journey-rule"/>
          <div className="eixo-login-journey-steps">
            <div><span className="eixo-login-step-dot">01</span><strong>Reconhecer</strong><small>Entenda seus padrões</small></div>
            <span className="eixo-login-step-line" aria-hidden="true"/>
            <div><span className="eixo-login-step-dot">02</span><strong>Praticar</strong><small>Construa presença</small></div>
            <span className="eixo-login-step-line" aria-hidden="true"/>
            <div><span className="eixo-login-step-dot">03</span><strong>Revisar</strong><small>Siga no seu ritmo</small></div>
          </div>
          <div className="eixo-login-journey-footer"><span>7 DIAS DE ROTEIRO</span><span>05 MATERIAIS DE APOIO</span></div>
        </div>
        <div className="eixo-login-editorial-footnote"><span className="eixo-login-footnote-icon" aria-hidden="true">✧</span> Confiança começa na mente. O ritmo é seu.</div>
      </section>

      <section className="eixo-login-auth-column" aria-labelledby="eixo-login-title">
        <div className="eixo-login-auth-card">
          <span className="eixo-login-auth-eyebrow"><span aria-hidden="true">✦</span> BEM-VINDO DE VOLTA</span>
          <h2 id="eixo-login-title">Acesse sua <em>área de membros.</em></h2>
          <p className="eixo-login-auth-description">Entre com o e-mail utilizado na compra e sua senha de acesso.</p>
          <LoginForm/>
        </div>
        <p className="eixo-login-help-footer"><LockMark size={14}/> Seu acesso é individual e protegido.</p>
        <Link href="/" className="eixo-login-back-home"><span aria-hidden="true">←</span> Voltar ao site</Link>
      </section>
    </div>

    <footer className="eixo-login-site-footer">
      <span>© MÉTODO EIXO</span>
      <span>CONFIANÇA COMEÇA NA MENTE</span>
      <span>Conteúdo educativo · Privacidade em primeiro lugar</span>
    </footer>
  </main>;
}
