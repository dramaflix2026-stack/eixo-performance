"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import "./app.css";

type MemberStatus="checking"|"authorized"|"unavailable";

export default function EixoMembersPage(){
  const [status,setStatus]=useState<MemberStatus>("checking");
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const response=await fetch("/api/eixo/auth/session",{credentials:"same-origin",cache:"no-store"});
        if(cancelled)return;
        if(response.status===401){window.location.replace("/login?acesso=necessario");return;}
        if(!response.ok){setStatus("unavailable");return;}
        const body=await response.json() as {authenticated?:boolean;email?:string};
        if(!body.authenticated){window.location.replace("/login?acesso=necessario");return;}
        setEmail(body.email||"");
        setStatus("authorized");
      }catch{if(!cancelled)setStatus("unavailable");}
    })();
    return ()=>{cancelled=true;};
  },[]);

  async function logout(){
    try{await fetch("/api/eixo/auth/logout",{method:"POST",credentials:"same-origin"});}catch{}
    window.location.replace("/login");
  }

  return <main className="eixo-member-page">
    <header className="eixo-member-header"><Link href="/" className="eixo-member-logo">EI<span>X</span>O.</Link><span>ÁREA DE MEMBROS</span></header>
    <section className="eixo-member-card">
      {status==="checking"?<p role="status">Validando seu acesso com segurança...</p>:
      status==="unavailable"?<>
        <h1>Não foi possível verificar seu acesso agora.</h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button onClick={()=>window.location.reload()}>Tentar novamente</button>
      </>:<>
        <div className="eixo-member-icon">✦</div>
        <span className="eixo-member-eyebrow">ACESSO CONFIRMADO</span>
        <h1>Bem-vindo ao seu espaço EIXO.</h1>
        <p>{email?<>Você entrou com <strong>{email}</strong>. </>:null}Sua autorização está ativa. Estamos preparando o painel com o roteiro de sete dias e os materiais do Método EIXO.</p>
        <div className="eixo-member-notice">O painel completo será disponibilizado na próxima etapa. O login e a autorização já são verificados no Supabase.</div>
        <button className="eixo-member-logout" onClick={logout}>Sair com segurança →</button>
      </>}
    </section>
    {message&&<p>{message}</p>}
    <footer>© MÉTODO EIXO · ACESSO RESTRITO</footer>
  </main>;
}
