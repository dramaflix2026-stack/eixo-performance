"use client";

import {useEffect,useId,useState,type FormEvent} from "react";

type Mode="login"|"first"|"recover";
function MailIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
function LockIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
function EyeIcon({visible}:{visible:boolean}){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7"/>{!visible&&<path d="m4 20 16-16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}</svg>}

export default function LoginForm(){
  const emailId=useId();
  const passId=useId();
  const [mode,setMode]=useState<Mode>("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [status,setStatus]=useState("");
  const [success,setSuccess]=useState(false);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    const hash=window.location.hash;
    if(!hash||!hash.includes("access_token"))return;
    const fragment=new URLSearchParams(hash.slice(1));
    const access_token=fragment.get("access_token");
    const refresh_token=fragment.get("refresh_token");
    const expires_in=Number(fragment.get("expires_in")||3600);
    // Remove tokens from the browser address immediately, without exposing them to tracking URLs.
    window.history.replaceState(null,"",window.location.pathname+window.location.search);
    if(!access_token||!refresh_token){setStatus("O link de confirmação está incompleto. Solicite um novo.");return;}
    if(fragment.get("type")==="recovery"){
      setMode("recover");
      setStatus("Link recebido. A alteração de senha estará disponível após concluirmos o isolamento das contas EIXO.");
      return;
    }
    let cancelled=false;
    setBusy(true);
    void (async()=>{
      try{
        const res=await fetch("/api/eixo/auth/complete-email",{
          method:"POST",credentials:"same-origin",cache:"no-store",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({access_token,refresh_token,expires_in})
        });
        const body=await res.json() as {ok?:boolean;authorized?:boolean;message?:string};
        if(cancelled)return;
        if(res.ok&&body.authorized){window.location.replace("/app");return;}
        setStatus(body.message||"Não foi possível concluir sua confirmação agora.");
        setSuccess(Boolean(body.ok));
      }catch{if(!cancelled)setStatus("Não foi possível confirmar o link. Verifique sua conexão.");}
      finally{if(!cancelled)setBusy(false);}
    })();
    return()=>{cancelled=true;};
  },[]);

  function navigate(next:Mode){setMode(next);setPassword("");setShowPassword(false);setStatus("");setSuccess(false);}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(busy)return;
    setBusy(true);setStatus("");setSuccess(false);
    const endpoint=mode==="login"?"/api/eixo/auth/login":mode==="first"?"/api/eixo/auth/register":"/api/eixo/auth/recover";
    try{
      const response=await fetch(endpoint,{
        method:"POST",credentials:"same-origin",cache:"no-store",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(mode==="recover"?{email:email.trim()}:{email:email.trim(),password})
      });
      const result=await response.json() as {ok?:boolean;message?:string;redirect?:string};
      if(mode==="login"&&response.ok&&result.ok){
        setPassword("");
        window.location.assign("/app");
        return;
      }
      setStatus(result.message||(response.ok?"Solicitação recebida.":"Não foi possível concluir. Tente novamente."));
      setSuccess(Boolean(response.ok&&result.ok));
    }catch{setStatus("Conexão indisponível. Verifique sua internet e tente novamente.");}
    finally{setPassword("");setShowPassword(false);setBusy(false);}
  }
  return <div className="eixo-login-form-root">
    <div className="eixo-login-connection-note" role="note">
      <span className="eixo-login-connection-dot" aria-hidden="true"/>
      <span>Autenticação Supabase · Acesso individual e protegido</span>
    </div>
    <form onSubmit={submit} className="eixo-login-form">
      {mode!=="login"&&<div className="eixo-login-mode-heading">
        <span>✦ {mode==="first"?"PRIMEIRO ACESSO":"SEGURANÇA DA CONTA"}</span>
        <h3>{mode==="first"?"Ativar minha conta":"Recuperar minha senha"}</h3>
        <p>{mode==="first"?"Utilize o e-mail da compra. Depois de confirmá-lo, a entrada depende de uma compra aprovada. O cadastro está protegido enquanto separamos os usuários do EIXO e do Toledo.":"Informe seu e-mail. Por segurança, o envio da recuperação será habilitado após isolarmos as contas do EIXO."}</p>
      </div>}
      <div className="eixo-login-field"><label htmlFor={emailId}>Seu e-mail</label>
        <div className="eixo-login-input-wrap"><MailIcon/><input type="email" id={emailId} autoComplete="email" placeholder="voce@exemplo.com" value={email} maxLength={254} onChange={e=>{setEmail(e.target.value);setStatus("");}} required/></div>
      </div>
      {mode!=="recover"&&<div className="eixo-login-field">
        <div className="eixo-login-label-row"><label htmlFor={passId}>{mode==="first"?"Crie uma senha":"Sua senha"}</label>
          {mode==="login"&&<button type="button" onClick={()=>navigate("recover")} className="eixo-login-text-link">Esqueci minha senha</button>}
        </div>
        <div className="eixo-login-input-wrap"><LockIcon/><input id={passId} type={showPassword?"text":"password"} autoComplete={mode==="first"?"new-password":"current-password"} placeholder={mode==="first"?"Mínimo de 10 caracteres":"Digite sua senha"} value={password} minLength={mode==="first"?10:6} maxLength={128} onChange={e=>{setPassword(e.target.value);setStatus("");}} required/>
        <button type="button" className="eixo-login-visibility" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Ocultar senha":"Mostrar senha"} aria-pressed={showPassword}><EyeIcon visible={showPassword}/></button></div>
      </div>}
      {status&&<div className="eixo-login-inline-notice" role="status" style={success?{borderColor:"#558463",background:"#192d23",color:"#c1f0ce"}:{}}>{status}</div>}
      <button className="eixo-login-submit" disabled={busy} type="submit"><span>{busy?"PROCESSANDO...":mode==="login"?"ENTRAR NA MINHA ÁREA":mode==="first"?"SOLICITAR ATIVAÇÃO":"ENVIAR LINK POR E-MAIL"}</span><span className="eixo-login-submit-arrow" aria-hidden="true">→</span></button>
    </form>
    {mode==="login"?<div className="eixo-login-signup"><span>Primeira vez por aqui?</span><button type="button" onClick={()=>navigate("first")}>Ativar meu acesso ↗</button></div>:
    <div className="eixo-login-signup"><button type="button" onClick={()=>navigate("login")}>← Voltar ao login</button></div>}
    <div className="eixo-login-form-bottom"><span aria-hidden="true">◈</span><p>Somente compras autorizadas liberam os conteúdos. O cadastro público e o envio de e-mails serão ativados depois do isolamento seguro do banco de autenticação.</p></div>
  </div>;
}
