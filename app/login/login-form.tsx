"use client";

import {useId,useState,type FormEvent} from "react";

type AccessMode="login"|"first"|"recover";

function EyeIcon({visible}:{visible:boolean}){
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7"/>
    {!visible&&<path d="m4 20 16-16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
  </svg>;
}

function MailIcon(){
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function LockIcon(){
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}

export default function LoginForm(){
  const emailId=useId();
  const passwordId=useId();
  const [mode,setMode]=useState<AccessMode>("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [status,setStatus]=useState("");

  const openMode=(next:AccessMode)=>{
    setMode(next);
    setPassword("");
    setShowPassword(false);
    setStatus("");
  };

  const handleSubmit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    // Frontend-only phase: no API request, session, token, or fake redirect.
    // The real Supabase Auth integration will replace this handler.
    setPassword("");
    setShowPassword(false);
    setStatus("A área de membros ainda está em configuração. O login será habilitado após a integração com o Supabase e a validação da compra.");
  };

  return <div className="eixo-login-form-root">
    <div className="eixo-login-connection-note" role="note">
      <span className="eixo-login-connection-dot" aria-hidden="true"/>
      <span>Prévia do portal · Autenticação em preparação</span>
    </div>
    {mode==="login"?<>
      <form className="eixo-login-form" onSubmit={handleSubmit} noValidate={false}>
        <div className="eixo-login-field">
          <label htmlFor={emailId}>Seu e-mail</label>
          <div className="eixo-login-input-wrap">
            <MailIcon/>
            <input id={emailId} name="email" type="email" autoComplete="email" inputMode="email" placeholder="voce@exemplo.com" value={email} onChange={event=>{setEmail(event.target.value);setStatus("");}} maxLength={254} required/>
          </div>
        </div>
        <div className="eixo-login-field">
          <div className="eixo-login-label-row"><label htmlFor={passwordId}>Sua senha</label>
            <button className="eixo-login-text-link" type="button" onClick={()=>openMode("recover")}>Esqueci minha senha</button>
          </div>
          <div className="eixo-login-input-wrap">
            <LockIcon/>
            <input id={passwordId} name="password" type={showPassword?"text":"password"} autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={event=>{setPassword(event.target.value);setStatus("");}} minLength={6} maxLength={128} required/>
            <button className="eixo-login-visibility" type="button" aria-label={showPassword?"Ocultar senha":"Mostrar senha"} aria-pressed={showPassword} onClick={()=>setShowPassword(value=>!value)}><EyeIcon visible={showPassword}/></button>
          </div>
        </div>
        {status&&<div className="eixo-login-inline-notice" role="status">{status}</div>}
        <button className="eixo-login-submit" type="submit"><span>ENTRAR NA MINHA ÁREA</span><span className="eixo-login-submit-arrow" aria-hidden="true">→</span></button>
      </form>
      <div className="eixo-login-signup"><span>Primeira vez por aqui?</span><button type="button" onClick={()=>openMode("first")}>Ativar meu acesso <span aria-hidden="true">↗</span></button></div>
    </>:<>
      <div className="eixo-login-mode-panel" aria-labelledby="eixo-login-mode-title">
        <div className="eixo-login-mode-icon" aria-hidden="true">{mode==="first"?"✦":"↺"}</div>
        <h3 id="eixo-login-mode-title">{mode==="first"?"Seu primeiro acesso":"Recuperar sua senha"}</h3>
        <p>{mode==="first"
          ?"Após a confirmação da compra, você poderá ativar sua conta com o e-mail utilizado no checkout. A ativação será disponibilizada quando conectarmos a autenticação."
          :"O envio de um link seguro de recuperação será ativado com o Supabase. Nenhuma mensagem é enviada nesta prévia."}</p>
        <button className="eixo-login-back-mode" type="button" onClick={()=>openMode("login")}>← Voltar ao login</button>
      </div>
    </>}
    <div className="eixo-login-form-bottom"><span aria-hidden="true">◈</span><p>Sem cadastro adicional nesta etapa. O acesso real dependerá da confirmação da compra e da autenticação segura.</p></div>
  </div>;
}
