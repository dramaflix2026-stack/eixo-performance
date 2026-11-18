"use client";

import {useEffect,useId,useState,type FormEvent} from "react";

type Mode="login"|"signup";
function MailIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
function LockIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
function EyeIcon({visible}:{visible:boolean}){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7"/>{!visible&&<path d="m4 20 16-16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}</svg>}

export default function LoginForm(){
  const emailId=useId();
  const passwordId=useId();
  const confirmationId=useId();
  const [mode,setMode]=useState<Mode>("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [status,setStatus]=useState("");
  const [success,setSuccess]=useState(false);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    const fragment=new URLSearchParams(window.location.hash.slice(1));
    const access_token=fragment.get("access_token");
    const refresh_token=fragment.get("refresh_token");
    const type=fragment.get("type")||"";
    const expires_in=Number(fragment.get("expires_in")||3600);
    if(fragment.get("error")||fragment.get("error_code")){
      window.history.replaceState(null,"",window.location.pathname);
      setStatus("Este link não pôde ser confirmado ou expirou. Solicite outro e-mail de cadastro.");
      setSuccess(false);
      return;
    }
    if(!access_token||!refresh_token)return;
    // Remove sensitive tokens from the visible URL before making any requests.
    window.history.replaceState(null,"",window.location.pathname);
    let cancelled=false;
    setBusy(true);
    void (async()=>{
      try{
        const response=await fetch("/api/eixo/auth/complete-email",{
          method:"POST",credentials:"same-origin",cache:"no-store",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({access_token,refresh_token,expires_in,type})
        });
        const result=await response.json() as {
          ok?:boolean;verified?:boolean;registered?:boolean;
          authorized?:boolean;message?:string;
        };
        if(cancelled)return;
        if(response.ok&&result.registered&&result.verified){
          setMode("login");
          setPassword("");
          setConfirmation("");
          setSuccess(true);
          setStatus("Cadastro confirmado com sucesso! Agora entre com seu e-mail e a senha que você criou.");
          return;
        }
        if(response.ok&&result.authorized&&type!=="signup"){
          window.location.replace("/app");
          return;
        }
        setMode("login");
        setSuccess(Boolean(response.ok&&result.verified));
        setStatus(result.message||"Não foi possível confirmar o e-mail. Solicite um novo link.");
      }catch{
        if(!cancelled){setSuccess(false);setStatus("Não foi possível confirmar o e-mail. Tente novamente.");}
      }finally{
        if(!cancelled)setBusy(false);
      }
    })();
    return()=>{cancelled=true;};
  },[]);

  function navigate(next:Mode){
    setMode(next);
    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setStatus("");
    setSuccess(false);
  }

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(busy)return;
    if(mode==="signup"&&password!==confirmation){
      setSuccess(false);
      setStatus("As senhas não coincidem. Confira e tente novamente.");
      return;
    }
    setBusy(true);
    setStatus("");
    setSuccess(false);
    try{
      const response=await fetch(mode==="login"?"/api/eixo/auth/login":"/api/eixo/auth/register",{
        method:"POST",credentials:"same-origin",cache:"no-store",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(mode==="login"?{
          email:email.trim(),password
        }:{
          email:email.trim(),password,confirmPassword:confirmation
        })
      });
      const result=await response.json() as {ok?:boolean;message?:string};
      if(mode==="login"&&response.ok&&result.ok){
        setPassword("");
        window.location.assign("/app");
        return;
      }
      setStatus(result.message||(response.ok?"Solicitação registrada.":"Não foi possível concluir. Tente novamente."));
      setSuccess(Boolean(response.ok&&result.ok));
      if(response.ok&&mode==="signup"){
        setPassword("");
        setConfirmation("");
      }
    }catch{
      setStatus("Conexão indisponível. Verifique sua internet e tente novamente.");
    }finally{
      setBusy(false);
    }
  }

  return <div className="eixo-login-form-root">
    {mode==="signup"&&<div className="eixo-login-mode-heading">
      <span>✦ CRIAR CADASTRO</span>
      <h3>Comece sua jornada no EIXO</h3>
      <p>Escolha seu e-mail e sua senha. Depois, confirme o cadastro no link que chegará à sua caixa de entrada.</p>
    </div>}
    <form onSubmit={submit} className="eixo-login-form">
      <div className="eixo-login-field">
        <label htmlFor={emailId}>Seu e-mail</label>
        <div className="eixo-login-input-wrap"><MailIcon/><input
          type="email" id={emailId} autoComplete="email"
          placeholder="voce@exemplo.com" value={email}
          maxLength={254} onChange={event=>setEmail(event.target.value)} required
        /></div>
      </div>
      <div className="eixo-login-field">
        <label htmlFor={passwordId}>{mode==="signup"?"Crie uma senha":"Sua senha"}</label>
        <div className="eixo-login-input-wrap"><LockIcon/><input
          id={passwordId} type={showPassword?"text":"password"}
          autoComplete={mode==="signup"?"new-password":"current-password"}
          placeholder={mode==="signup"?"Escolha sua senha":"Digite sua senha"}
          value={password} maxLength={128}
          onChange={event=>setPassword(event.target.value)} required
        /><button type="button" className="eixo-login-visibility"
          onClick={()=>setShowPassword(value=>!value)}
          aria-label={showPassword?"Ocultar senha":"Mostrar senha"}
          aria-pressed={showPassword}><EyeIcon visible={showPassword}/></button></div>
      </div>
      {mode==="signup"&&<div className="eixo-login-field">
        <label htmlFor={confirmationId}>Confirme sua senha</label>
        <div className="eixo-login-input-wrap"><LockIcon/><input
          id={confirmationId} type={showPassword?"text":"password"}
          autoComplete="new-password" placeholder="Digite a mesma senha novamente"
          value={confirmation} maxLength={128}
          onChange={event=>setConfirmation(event.target.value)} required
        /></div>
      </div>}
      {status&&<div className="eixo-login-inline-notice" role="status"
        style={success?{borderColor:"#558463",background:"#192d23",color:"#c1f0ce"}:{}}>
        {success&&<span aria-hidden="true">✓ </span>}{status}
      </div>}
      <button className="eixo-login-submit" disabled={busy} type="submit">
        <span>{busy?"PROCESSANDO...":mode==="login"?"ENTRAR NA MINHA ÁREA":"CRIAR CADASTRO"}</span>
        <span className="eixo-login-submit-arrow" aria-hidden="true">→</span>
      </button>
    </form>
    {mode==="login"?<div className="eixo-login-signup">
      <span>Ainda não tem uma conta?</span>
      <button type="button" onClick={()=>navigate("signup")}>Criar cadastro ↗</button>
    </div>:<div className="eixo-login-signup">
      <span>Já confirmou seu e-mail?</span>
      <button type="button" onClick={()=>navigate("login")}>Fazer login ↗</button>
    </div>}
    <div className="eixo-login-form-bottom">
      <span aria-hidden="true">◈</span>
      <p>Cadastro individual. O e-mail precisa ser confirmado antes do login. O acesso ao conteúdo do Método EIXO é liberado apenas após uma compra aprovada ou autorização de teste.</p>
    </div>
  </div>;
}
