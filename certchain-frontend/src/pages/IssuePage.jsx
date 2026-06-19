import { useState, useRef } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function IssuePage() {
  const [form, setForm] = useState({ studentName:"", studentEmail:"", degree:"", institution:"", mention:"" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const certRef = useRef(null);
  const upd = (k) => (e) => setForm({...form, [k]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:8080/api/certificates/issue", form, {
        headers: { Authorization: "Bearer " + token }
      });
      setResult(res.data); setError(null);
    } catch {
      setError("Erreur - verifiez que vous etes connecte.");
    }
    setLoading(false);
  };
  const exportPDF = async () => {
    setPdfLoading(true);
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, (pdf.internal.pageSize.getHeight() - h) / 2, w, h);
    pdf.save("certificat-" + result.studentName.replace(/ /g, "-") + ".pdf");
    setPdfLoading(false);
  };
  const verifyUrl = result ? window.location.origin + "/verify?hash=" + result.certHash : "";
  return (
    <div style={{position:"relative", zIndex:1, maxWidth:"1400px", margin:"2rem auto", padding:"0 1rem"}}>
      <div style={{display:"flex", gap:"2rem", alignItems:"flex-start", flexWrap:"wrap"}}>
        {/* GAUCHE - Formulaire */}
        <div className="glass-card" style={{flex:"0 0 360px", minWidth:"320px"}}>
          <p className="page-title">Emettre un certificat</p>
          <p className="page-sub">Enregistrez un diplome de facon permanente et infalsifiable</p>
          <form onSubmit={handleSubmit}>
            {[
              ["studentName","Nom complet","Nom complet"],
              ["studentEmail","Adresse email","Adresse email"],
              ["degree","Diplome","Ex: Licence Informatique"],
              ["institution","Institution","Ex: ENICarthage"],
            ].map(([k,label,ph]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder={ph} value={form[k]} onChange={upd(k)} required />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Mention</label>
              <select className="form-input" value={form.mention} onChange={upd("mention")} required>
                <option value="">Selectionner une mention</option>
                <option value="Passable">Passable</option>
                <option value="Assez Bien">Assez Bien</option>
                <option value="Bien">Bien</option>
                <option value="Tres Bien">Tres Bien</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Enregistrement sur la blockchain..." : "Enregistrer sur la blockchain"}
            </button>
          </form>
          {error && <div className="alert alert-error fade-in" style={{marginTop:"1rem"}}><p>{error}</p></div>}
        </div>
        {/* DROITE - Certificat */}
        <div style={{flex:"1 1 600px", minWidth:"320px"}}>
          {!result && (
            <div className="glass-card" style={{textAlign:"center", padding:"4rem 2rem", opacity:0.5}}>
              <p style={{color:"#475569"}}>Le certificat apparaitra ici apres emission</p>
            </div>
          )}
          {result && (
            <div className="fade-in">
              <div ref={certRef} style={{
                background:"linear-gradient(135deg, #ffffff 0%, #f7f7f5 100%)",
                border:"2px solid #c9a84c",
                borderRadius:"16px",
                padding:"1.6rem 2.4rem",
                position:"relative",
                overflow:"hidden",
                display:"flex",
                flexDirection:"column",
                gap:"0.6rem"
              }}>
                {/* Coins decoratifs */}
                <div style={{position:"absolute",top:0,left:0,width:"30px",height:"30px",borderTop:"3px solid #c9a84c",borderRight:"3px solid #c9a84c"}}></div>
                <div style={{position:"absolute",top:0,right:0,width:"30px",height:"30px",borderTop:"3px solid #c9a84c",borderLeft:"3px solid #c9a84c"}}></div>
                <div style={{position:"absolute",bottom:0,left:0,width:"30px",height:"30px",borderBottom:"3px solid #c9a84c",borderRight:"3px solid #c9a84c"}}></div>
                <div style={{position:"absolute",bottom:0,right:0,width:"30px",height:"30px",borderBottom:"3px solid #c9a84c",borderLeft:"3px solid #c9a84c"}}></div>
                {/* En-tete officiel avec logos */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
                  <img src="/enicarthage-logo.png" alt="ENICarthage" style={{height:"70px",objectFit:"contain"}} />
                  <div style={{textAlign:"center",flex:1}}>
                    <p style={{fontSize:"0.5rem",color:"#64748b",letterSpacing:"1px",lineHeight:1.3,margin:0}}>
                      Ministere de l'Enseignement Superieur<br/>Et la Recherche Scientifique
                    </p>
                    <p style={{fontSize:"0.6rem",color:"#b8860b",fontWeight:"700",letterSpacing:"1px",margin:"0.15rem 0 0"}}>
                      Universite de Carthage
                    </p>
                    <p style={{fontSize:"0.5rem",color:"#64748b",margin:0}}>
                      Ecole Nationale d'Ingenieurs de Carthage
                    </p>
                  </div>
                  <img src="/uc-logo.jpg" alt="Universite de Carthage" style={{height:"70px",objectFit:"contain"}} />
                </div>
                {/* Titre */}
                <div style={{textAlign:"center"}}>
                  <p style={{fontSize:"0.65rem",color:"#b8860b",letterSpacing:"4px",textTransform:"uppercase",margin:0}}>
                    Republique Tunisienne
                  </p>
                  <div style={{width:"50px",height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c,transparent)",margin:"0.35rem auto"}}></div>
                  <p style={{fontSize:"1.8rem",fontWeight:"800",color:"#0a1628",letterSpacing:"3px",textTransform:"uppercase",margin:0}}>
                    Certificat
                  </p>
                  <p style={{fontSize:"0.85rem",color:"#b8860b",letterSpacing:"2px",margin:0}}>de Diplome Officiel</p>
                </div>
                {/* Corps - deux colonnes */}
                <div style={{flex:1, display:"grid", gridTemplateColumns:"1fr 170px", alignItems:"center", gap:"1.5rem", padding:"0.5rem 0"}}>
                  <div style={{textAlign:"center"}}>
                    <p style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"0.3rem"}}>Ce certificat atteste que</p>
                    <p style={{
                      fontSize:"2rem",fontWeight:"800",color:"#0a1628",
                      borderBottom:"2px solid #c9a84c",display:"inline-block",
                      paddingBottom:"0.2rem",marginBottom:"0.7rem",letterSpacing:"1px"
                    }}>
                      {result.studentName}
                    </p>
                    <p style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"0.3rem"}}>a obtenu avec succes le diplome de</p>
                    <p style={{fontSize:"1.25rem",fontWeight:"700",color:"#2563eb",marginBottom:"0.5rem"}}>{result.degree}</p>
                    <p style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"0.6rem"}}>
                      delivre par <strong style={{color:"#1e293b"}}>{result.institution}</strong>
                    </p>
                    <div style={{
                      display:"inline-block",background:"rgba(201,168,76,0.12)",
                      border:"1px solid rgba(201,168,76,0.5)",borderRadius:"999px",
                      padding:"0.25rem 1.2rem"
                    }}>
                      <p style={{color:"#b8860b",fontSize:"0.85rem",fontWeight:"600",margin:0}}>Mention : {result.mention}</p>
                    </div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{background:"white",padding:"8px",borderRadius:"8px",display:"inline-block",border:"1px solid #e2e8f0",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                      <QRCodeSVG value={verifyUrl} size={110} />
                    </div>
                    <p style={{fontSize:"0.65rem",color:"#94a3b8",marginTop:"0.4rem",margin:0}}>Scanner pour verifier</p>
                  </div>
                </div>
                {/* Footer */}
                <div style={{
                  borderTop:"1px solid rgba(201,168,76,0.4)",paddingTop:"0.7rem",
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  flexWrap:"wrap",gap:"0.5rem"
                }}>
                  <p style={{
                    fontFamily:"monospace",fontSize:"0.6rem",color:"#2563eb",
                    wordBreak:"break-all",cursor:"pointer",margin:0
                  }} onClick={() => navigator.clipboard.writeText(result.certHash)}>
                    Hash : {result.certHash} [Copier]
                  </p>
                  <div style={{display:"flex",gap:"1rem",alignItems:"center",flexShrink:0}}>
                    <p style={{fontSize:"0.65rem",color:"#94a3b8",margin:0}}>
                      Date : {new Date(result.issueDate).toLocaleDateString("fr-FR")}
                    </p>
                    {result.txHash && (
                      <a href={"https://sepolia.etherscan.io/tx/" + result.txHash}
                        target="_blank" rel="noopener noreferrer"
                        style={{color:"#b8860b",fontSize:"0.65rem"}}>
                        Verifier sur Etherscan &gt;&gt;
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={exportPDF} disabled={pdfLoading}
                style={{marginTop:"1rem",background:"linear-gradient(135deg,#c9a84c,#b8860b)",color:"#000",fontWeight:"700"}}>
                {pdfLoading ? "Generation PDF..." : "Telecharger le certificat PDF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}