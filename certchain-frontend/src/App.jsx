import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import IssuePage from "./pages/IssuePage";
import VerifyPage from "./pages/VerifyPage";
import ListPage from "./pages/ListPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">C</div>
        <span className="brand-text">CertChain</span>
      </div>
      <div className="navbar-links">
        {username ? (
          <>
            <Link to="/" className={`nav-link ${loc.pathname === "/" ? "active" : ""}`}>Emettre</Link>
            <Link to="/list" className={`nav-link ${loc.pathname === "/list" ? "active" : ""}`}>Certificats</Link>
          </>
        ) : null}
        <Link to="/verify" className={`nav-link ${loc.pathname === "/verify" ? "active" : ""}`}>Verifier</Link>
        {username ? (
          <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginLeft:"0.5rem"}}>
            <span style={{color:"#64748b",fontSize:"0.85rem"}}>{username}</span>
            <button onClick={logout} style={{background:"rgba(239,68,68,0.15)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.3)",padding:"0.35rem 0.9rem",borderRadius:"6px",fontSize:"0.82rem",cursor:"pointer"}}>
              Deconnexion
            </button>
          </div>
        ) : (
          <Link to="/login" className={`nav-link ${loc.pathname === "/login" ? "active" : ""}`}>Connexion</Link>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/" element={<PrivateRoute><IssuePage /></PrivateRoute>} />
        <Route path="/list" element={<PrivateRoute><ListPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;