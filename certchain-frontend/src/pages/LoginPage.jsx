import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/");
    } catch {
      setError("Identifiants incorrects");
    }
    setLoading(false);
  };
  return (
    <div className="page" style={{marginTop:"5rem"}}>
      <div className="glass-card" style={{maxWidth:"420px", margin:"0 auto"}}>
        <div style={{textAlign:"center", marginBottom:"2rem"}}>
          <div style={{width:"52px",height:"52px",borderRadius:"12px",background:"linear-gradient(135deg,#3b82f6,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",fontSize:"1.4rem"}}>C</div>
          <p className="page-title" style={{fontSize:"1.4rem"}}>Connexion</p>
          <p className="page-sub">Espace universite CertChain</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Nom d utilisateur</label>
            <input className="form-input" placeholder="ex: enicar" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        {error && <div className="alert alert-error fade-in" style={{marginTop:"1rem"}}><p>{error}</p></div>}
      </div>
    </div>
  );
}