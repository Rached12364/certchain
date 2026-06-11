import { useState } from "react";
import axios from "axios";
export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleVerify = async () => {
    if (!hash.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/certificates/verify/" + hash.trim());
      setResult(res.data);
    } catch { setResult({ exists: false, valid: false }); }
    setLoading(false);
  };
  return (
    <div className="page">
      <div className="glass-card">
        <p className="page-title">Verifier un certificat</p>
        <p className="page-sub">Collez le hash pour confirmer l authenticite d un diplome</p>
        <div className="form-group">
          <label className="form-label">Hash du certificat</label>
          <input className="form-input" placeholder="ex: f34c3f3c05c39..." value={hash}
            onChange={e => setHash(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerify()} />
        </div>
        <button className="btn-primary" onClick={handleVerify} disabled={loading}>
          {loading ? "Verification..." : "Verifier l authenticite"}
        </button>
        {result && result.exists && result.valid && (
          <div className="alert alert-success fade-in">
            <p className="alert-title">Certificat valide</p>
            <div className="divider" style={{margin:"0.8rem 0"}}></div>
            <p>Etudiant : <strong>{result.studentName}</strong></p>
            <p>Diplome : {result.degree}</p>
            <p>Institution : {result.institution}</p>
            <p>Date : {new Date(result.issueDate).toLocaleDateString("fr-FR")}</p>
            {result.txHash && (
              <div style={{marginTop:"1rem"}}>
                <p style={{fontSize:"0.8rem",color:"#94a3b8",marginBottom:"0.3rem"}}>Transaction Blockchain :</p>
                <a href={"https://sepolia.etherscan.io/tx/" + result.txHash}
                  target="_blank" rel="noopener noreferrer"
                  style={{color:"#60a5fa",fontSize:"0.78rem",wordBreak:"break-all",textDecoration:"none"}}>
                  Voir sur Etherscan
                </a>
              </div>
            )}
          </div>
        )}
        {result && !result.exists && (
          <div className="alert alert-error fade-in">
            <p className="alert-title">Certificat introuvable</p>
            <p>Ce hash ne correspond a aucun certificat enregistre.</p>
          </div>
        )}
      </div>
    </div>
  );
}