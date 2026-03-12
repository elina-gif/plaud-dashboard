"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true); setError("");
    const res  = await fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ password: pw }) });
    if (res.ok) router.push("/");
    else { setError("Wrong password. Try again."); setLoading(false); }
  };

  return (
    <div style={{ background:"#0f1117", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <div style={{ background:"#1a1d27", border:"1px solid #2a2d3a", borderRadius:16, padding:"40px 48px", width:360, textAlign:"center" }}>
        <div style={{ background:"linear-gradient(135deg,#6366f1,#22d3ee)", borderRadius:12, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:"#fff", fontWeight:800, fontSize:22 }}>P</div>
        <div style={{ color:"#e2e8f0", fontWeight:800, fontSize:18, marginBottom:4 }}>Plaud PR Intelligence</div>
        <div style={{ color:"#94a3b8", fontSize:12, marginBottom:28 }}>Enter password to continue</div>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Password"
          style={{ width:"100%", background:"#13151f", border:"1px solid #2a2d3a", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:13, outline:"none", marginBottom:12, boxSizing:"border-box" }}
        />
        {error && <div style={{ color:"#f43f5e", fontSize:11, marginBottom:10 }}>{error}</div>}
        <button onClick={submit} disabled={loading}
          style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#22d3ee)", color:"#fff", border:"none", borderRadius:8, padding:"10px", fontSize:13, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
          {loading ? "Checking..." : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}