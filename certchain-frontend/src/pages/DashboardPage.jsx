import { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);
const COLORS = ["#3b82f6","#a78bfa","#6ee7b7","#f59e0b","#ec4899","#14b8a6"];
const darkTicks = { color:"#64748b", font:{size:11} };
const darkGrid  = { color:"rgba(255,255,255,0.05)" };
export default function DashboardPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8080/api/certificates", {
      headers: { Authorization: "Bearer " + token }
    }).then(res => {
      setCerts(res.data);
      setLoading(false);
      generateInsight();
    }).catch(e => { setError(e.message); setLoading(false); });
  }, []);
  const generateInsight = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/certificates/insight", {
        headers: { Authorization: "Bearer " + token }
      });
      setAiInsight(res.data.text);
    } catch (e) {
      setAiInsight("Impossible de generer l analyse pour le moment.");
    }
    setAiLoading(false);
  };
  if (loading) return <div style={{position:"relative",zIndex:10,color:"white",padding:"2rem"}}>Chargement...</div>;
  if (error)   return <div style={{position:"relative",zIndex:10,color:"red",padding:"2rem"}}>Erreur: {error}</div>;
  const total        = certs.length;
  const onChain      = certs.filter(c => c.txHash).length;
  const institutions = [...new Set(certs.map(c => c.institution))].length;
  const recent       = [...certs].sort((a,b) => new Date(b.issueDate)-new Date(a.issueDate)).slice(0,5);
  const byMention = certs.reduce((a,c) => { a[c.mention]=(a[c.mention]||0)+1; return a; }, {});
  const byDate    = {};
  [...certs].sort((a,b)=>new Date(a.issueDate)-new Date(b.issueDate)).forEach(c => {
    const d = new Date(c.issueDate).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
    byDate[d] = (byDate[d]||0)+1;
  });
  return (
    <div style={{position:"relative", zIndex:10, maxWidth:"1100px", margin:"2rem auto", padding:"0 1rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"2rem"}}>
        {[
          ["Total", total, "#3b82f6"],
          ["Sur blockchain", onChain, "#a78bfa"],
          ["Taux", Math.round((onChain/total)*100)+"%", "#6ee7b7"],
          ["Institutions", institutions, "#f59e0b"],
        ].map(([label,val,color]) => (
          <div key={label} style={{background:"rgba(15,23,42,0.9)",border:`1px solid ${color}40`,borderRadius:"12px",padding:"1.5rem"}}>
            <p style={{fontSize:"0.75rem",color:"#64748b",marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"1px"}}>{label}</p>
            <p style={{fontSize:"2rem",fontWeight:"800",color,margin:0}}>{val}</p>
          </div>
        ))}
      </div>
      {/* ANALYSE IA */}
      <div style={{background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(167,139,250,0.08))",border:"1px solid rgba(99,179,237,0.25)",borderRadius:"12px",padding:"1.5rem",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.8rem"}}>
          <span style={{fontSize:"0.7rem",color:"#a78bfa",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>Analyse IA</span>
        </div>
        {aiLoading
          ? <p style={{color:"#64748b",fontSize:"0.85rem",margin:0}}>Generation de l'analyse...</p>
          : <p style={{color:"#cbd5e1",fontSize:"0.9rem",lineHeight:1.6,margin:0}}>{aiInsight}</p>
        }
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"1.5rem"}}>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"12px",padding:"1.5rem"}}>
          <p style={{fontWeight:"700",color:"#f1f5f9",marginBottom:"1rem"}}>Evolution dans le temps</p>
          <div style={{height:"220px"}}>
            <Line
              data={{ labels:Object.keys(byDate), datasets:[{ label:"Certificats", data:Object.values(byDate), borderColor:"#3b82f6", backgroundColor:"rgba(59,130,246,0.1)", fill:true, tension:0.4, pointBackgroundColor:"#3b82f6", pointRadius:5 }] }}
              options={{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{ticks:darkTicks,grid:darkGrid},y:{ticks:{...darkTicks,stepSize:1},grid:darkGrid}} }}
            />
          </div>
        </div>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"12px",padding:"1.5rem"}}>
          <p style={{fontWeight:"700",color:"#f1f5f9",marginBottom:"1rem"}}>Par mention</p>
          <div style={{height:"220px"}}>
            <Doughnut
              data={{ labels:Object.keys(byMention), datasets:[{ data:Object.values(byMention), backgroundColor:COLORS, borderWidth:0, hoverOffset:8 }] }}
              options={{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:"bottom",labels:{color:"#94a3b8",font:{size:12},padding:12,boxWidth:12}}} }}
            />
          </div>
        </div>
      </div>
      <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"12px",padding:"1.5rem"}}>
        <p style={{fontWeight:"700",color:"#f1f5f9",marginBottom:"1.2rem"}}>Activite recente</p>
        {recent.map((c,i) => (
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.8rem 0",borderBottom:i<recent.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
            <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:"700",color:"#60a5fa",flexShrink:0}}>
              {c.studentName.charAt(0).toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontWeight:"600",color:"#f1f5f9",fontSize:"0.9rem",margin:0}}>{c.studentName}</p>
              <p style={{color:"#64748b",fontSize:"0.78rem",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.degree} — {c.institution}</p>
            </div>
            <p style={{color:"#475569",fontSize:"0.75rem",flexShrink:0}}>{new Date(c.issueDate).toLocaleDateString("fr-FR")}</p>
            {c.txHash && <a href={"https://sepolia.etherscan.io/tx/"+c.txHash} target="_blank" rel="noopener noreferrer" style={{color:"#a78bfa",fontSize:"0.8rem",textDecoration:"none"}}>⛓</a>}
          </div>
        ))}
      </div>
    </div>
  );
}