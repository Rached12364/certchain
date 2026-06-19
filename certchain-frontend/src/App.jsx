import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import IssuePage from "./pages/IssuePage";
import VerifyPage from "./pages/VerifyPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import { Award } from 'lucide-react';
import "./App.css";
function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
        <div className="brand-icon"><Award size={20} strokeWidth={2.5} /></div>
        <span className="brand-text">CertChain</span>
      </div>
      <div className="navbar-links">
        <Link to="/verify" className={"nav-link " + (loc.pathname === "/verify" ? "active" : "")}>Verifier</Link>
        {username ? (
          <>
            <Link to="/issue" className={"nav-link " + (loc.pathname === "/issue" ? "active" : "")}>Emettre</Link>
            <Link to="/dashboard" className={"nav-link " + (loc.pathname === "/dashboard" ? "active" : "")}>Dashboard</Link>
            <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginLeft:"0.5rem"}}>
              <span style={{color:"#64748b",fontSize:"0.85rem"}}>{username}</span>
              <button onClick={logout} style={{background:"rgba(239,68,68,0.15)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.3)",padding:"0.35rem 0.9rem",borderRadius:"6px",fontSize:"0.82rem",cursor:"pointer"}}>
                Deconnexion
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className={"nav-link " + (loc.pathname === "/login" ? "active" : "")}>Connexion</Link>
        )}
      </div>
    </nav>
  );
}
function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) { setTimeout(() => navigate("/login"), 0); return null; }
  return children;
}
function App() {
  return (
    <BrowserRouter>
      <div className="app-bg"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/issue" element={<PrivateRoute><IssuePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;