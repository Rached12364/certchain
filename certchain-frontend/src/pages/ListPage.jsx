import { useEffect, useState } from "react";
import axios from "axios";
export default function ListPage() {
  const [certs, setCerts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8080/api/certificates", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setCerts(r.data)).catch(()=>{});
  }, []);
  return (
    <div className="page" style={{maxWidth:"780px"}}>
      <div className="glass-card">
        <p className="page-title">Certificats enregistres</p>
        <p className="page-sub">{certs.length} diplome{certs.length !== 1 ? "s" : ""} sur la blockchain</p>
        <div className="divider"></div>
        {certs.length === 0 && (
          <p style={{color:"#475569",textAlign:"center",padding:"2rem 0"}}>Aucun certificat pour le moment.</p>
        )}
        {certs.map(cert => (
          <div className="cert-card fade-in" key={cert.id}>
            <div className="cert-top">
              <div>
                <p className="cert-name">{cert.studentName}</p>
                <p className="cert-degree">{cert.degree} — {cert.institution}</p>
              </div>
              <span className="badge-valid">{cert.status}</span>
            </div>
            <p className="cert-hash">{cert.certHash}</p>
          </div>
        ))}
      </div>
    </div>
  );
}