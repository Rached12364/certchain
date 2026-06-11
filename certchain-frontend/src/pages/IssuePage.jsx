import { useState } from "react";
import axios from "axios";
export default function IssuePage() {
  const [form, setForm] = useState({ studentName:"", studentEmail:"", degree:"", institution:"", mention:"" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
    } catch { setError("Erreur — verifiez que vous etes connecte."); }
    setLoading(false);
  };
  return (
    <div className="page">
      <div className="glass-card">
        <p className="page-title">Emettre un certificat</p>
        <p className="page-sub">Enregistrez un diplome de facon permanente et infalsifiable</p>
        <form onSubmit={handleSubmit}>
          {[
            ["studentName","Nom complet","Ex: Ali Rached"],
            ["studentEmail","Adresse email","Ex: ali@enicar.tn"],
            ["degree","Diplome","Ex: Licence Informatique"],
            ["institution","Institution","Ex: ENICarthage"],
            ["mention","Mention","Ex: Tres Bien"],
          ].map(([k,label,ph]) => (
            <div className="form-group" key={k}>
              <label className="form-label">{label}</label>
              <input className="form-input" placeholder={ph} value={form[k]} onChange={upd(k)} required />
            </div>
          ))}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Enregistrement sur la blockchain..." : "Enregistrer sur la blockchain"}
          </button>
        </form>
        {result && (
          <div className="alert alert-success fade-in">
            <p className="alert-title">Certificat enregistre avec succes</p>
            <p>Etudiant : <strong>{result.studentName}</strong> — {result.degree}</p>
            <p style={{marginTop:"0.5rem"}}>Hash du certificat :</p>
            <div className="hash-box">{result.certHash}</div>
            {result.txHash && (
              <div style={{marginTop:"0.8rem"}}>
                <p style={{fontSize:"0.8rem",color:"#6ee7b7",marginBottom:"0.3rem"}}>
                  Transaction enregistree sur Sepolia :
                </p>
                <a href={"https://sepolia.etherscan.io/tx/" + result.txHash}
                  target="_blank" rel="noopener noreferrer"
                  style={{color:"#60a5fa",fontSize:"0.78rem",wordBreak:"break-all"}}>
                  Voir sur Etherscan
                </a>
              </div>
            )}
          </div>
        )}
        {error && <div className="alert alert-error fade-in"><p>{error}</p></div>}
      </div>
    </div>
  );
}