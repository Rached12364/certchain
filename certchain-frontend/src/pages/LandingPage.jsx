import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState({});
  const refs = useRef({});
  useEffect(() => {
    const observers = {};
    Object.keys(refs.current).forEach(key => {
      observers[key] = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisible(v => ({...v, [key]: true}));
      }, { threshold: 0.2 });
      if (refs.current[key]) observers[key].observe(refs.current[key]);
    });
    return () => Object.values(observers).forEach(o => o.disconnect());
  }, []);
  const fadeUp = (key, delay = 0) => ({
    ref: el => refs.current[key] = el,
    style: {
      opacity: visible[key] ? 1 : 0,
      transform: visible[key] ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }
  });
  return (
    <div style={{position:"relative",zIndex:1,width:"100%",overflow:"hidden"}}>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .btn-glow:hover{box-shadow:0 0 25px rgba(59,130,246,0.6)!important;transform:translateY(-2px)!important}
        .btn-glow{transition:all 0.3s ease!important}
        .card-hover:hover{transform:translateY(-6px)!important;border-color:rgba(99,179,237,0.4)!important}
        .card-hover{transition:all 0.3s ease!important}
      `}</style>
      {/* HERO — 2 colonnes */}
      <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",padding:"0 6rem",gap:"4rem"}}>
        {/* GAUCHE — Titre */}
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:"999px",padding:"0.4rem 1rem",marginBottom:"2rem",fontSize:"0.8rem",color:"#60a5fa"}}>
            <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#60a5fa",display:"inline-block",animation:"pulse 1.5s infinite"}}></span>
            Propulse par Ethereum Sepolia Testnet
          </div>
          <h1 style={{fontSize:"clamp(2.8rem,5vw,4.5rem)",fontWeight:"800",color:"#ffffff",lineHeight:1.1,marginBottom:"0"}}>
            Certifiez vos<br/>diplomes sur la<br/>
            <span style={{background:"linear-gradient(90deg,#3b82f6,#a78bfa,#6ee7b7,#3b82f6)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradientShift 3s linear infinite"}}>
              Blockchain
            </span>
          </h1>
        </div>
        {/* DROITE — Description + Boutons + Stats */}
        <div style={{display:"flex",flexDirection:"column",gap:"2rem"}}>
          <p style={{fontSize:"1.1rem",color:"#64748b",lineHeight:1.8}}>
            CertChain permet aux universites d emettre des diplomes infalsifiables
            et verifiables publiquement sur Ethereum. Zero fraude, zero intermediaire.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
            <button onClick={() => navigate("/login")} className="btn-glow" style={{padding:"0.9rem 2rem",background:"linear-gradient(135deg,#2563eb,#4f46e5)",color:"white",border:"none",borderRadius:"8px",fontSize:"1rem",fontWeight:"600",cursor:"pointer",width:"100%"}}>
              Connexion Universite
            </button>
            <button onClick={() => navigate("/verify")} className="btn-glow" style={{padding:"0.9rem 2rem",background:"rgba(255,255,255,0.05)",color:"#f1f5f9",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",fontSize:"1rem",fontWeight:"600",cursor:"pointer",width:"100%"}}>
              Verifier un diplome
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"1.5rem"}}>
            {[["100%","Infalsifiable","#60a5fa"],["0","Intermediaire","#a78bfa"],["24/7","Verifiable","#6ee7b7"],["inf","Permanent","#f59e0b"]].map(([val,label,color]) => (
              <div key={label} style={{textAlign:"center"}}>
                <p style={{fontSize:"1.8rem",fontWeight:"800",color,margin:0}}>{val}</p>
                <p style={{fontSize:"0.72rem",color:"#475569",margin:0}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* COMMENT CA MARCHE */}
      <div style={{width:"100%",padding:"4rem 6rem"}}>
        <div {...fadeUp("steps")}>
          <h2 style={{textAlign:"center",fontSize:"2rem",fontWeight:"700",color:"#f1f5f9",marginBottom:"0.5rem"}}>Comment ca marche ?</h2>
          <p style={{textAlign:"center",color:"#475569",marginBottom:"3rem"}}>3 etapes simples pour certifier un diplome</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
          {[
            ["01","Universite se connecte","L universite s authentifie avec son compte securise JWT","#3b82f6"],
            ["02","Emet le diplome","Les donnees sont hashees en SHA-256 et envoyees sur Ethereum","#a78bfa"],
            ["03","Verification publique","N importe qui peut scanner le QR code ou coller le hash","#6ee7b7"],
          ].map(([num,title,desc,color],i) => (
            <div key={num} {...fadeUp("card"+i,i*0.2)} className="card-hover" style={{background:"rgba(15,23,42,0.72)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"16px",padding:"2rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${color},transparent)`}}></div>
              <p style={{position:"absolute",top:"1rem",right:"1rem",fontSize:"3rem",fontWeight:"800",color:"rgba(255,255,255,0.05)"}}>{num}</p>
              <p style={{fontSize:"2rem",marginBottom:"1rem"}}>{num==="01"?"🏛":num==="02"?"📝":"✅"}</p>
              <p style={{fontWeight:"700",color:"#f1f5f9",marginBottom:"0.5rem"}}>{title}</p>
              <p style={{fontSize:"0.85rem",color:"#64748b",lineHeight:1.6}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* POURQUOI BLOCKCHAIN */}
      <div style={{width:"100%",padding:"2rem 6rem 4rem"}}>
        <div {...fadeUp("why")}>
          <h2 style={{textAlign:"center",fontSize:"2rem",fontWeight:"700",color:"#f1f5f9",marginBottom:"3rem"}}>Pourquoi la Blockchain ?</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"1rem"}}>
          {[
            ["Immutable","Une fois enregistre, impossible de modifier","#3b82f6"],
            ["Decentralise","Aucun serveur central","#a78bfa"],
            ["Transparent","Verifiable publiquement","#6ee7b7"],
            ["Instantane","Verification en 1 seconde","#f59e0b"],
            ["Tracable","Visible sur Etherscan","#ec4899"],
            ["Permanent","Existe pour toujours","#14b8a6"],
          ].map(([title,desc,color],i) => (
            <div key={title} {...fadeUp("why"+i,i*0.1)} className="card-hover" style={{background:"rgba(15,23,42,0.5)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.5rem",textAlign:"center"}}>
              <p style={{fontWeight:"700",color,marginBottom:"0.3rem",fontSize:"0.9rem"}}>{title}</p>
              <p style={{fontSize:"0.78rem",color:"#475569",lineHeight:1.5}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div {...fadeUp("cta")} style={{textAlign:"center",padding:"4rem 6rem"}}>
        <div style={{background:"rgba(15,23,42,0.72)",border:"1px solid rgba(99,179,237,0.2)",borderRadius:"20px",padding:"3rem",maxWidth:"700px",margin:"0 auto"}}>
          <p style={{fontSize:"1.8rem",fontWeight:"700",color:"#f1f5f9",marginBottom:"0.5rem"}}>Pret a certifier vos diplomes ?</p>
          <p style={{color:"#475569",marginBottom:"2rem"}}>Rejoignez CertChain et eliminez la fraude aux diplomes</p>
          <button onClick={() => navigate("/login")} className="btn-glow" style={{padding:"0.9rem 2.5rem",background:"linear-gradient(135deg,#2563eb,#4f46e5)",color:"white",border:"none",borderRadius:"8px",fontSize:"1rem",fontWeight:"600",cursor:"pointer"}}>
            Commencer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}