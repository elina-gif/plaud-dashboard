"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const DARK   = "#0f1117";
const CARD   = "#1a1d27";
const BORDER = "#2a2d3a";
const TEXT   = "#e2e8f0";
const MUTED  = "#94a3b8";
const ACCENT = "#6366f1";
const CYAN   = "#22d3ee";
const TREND_COLORS = ["#6366f1","#22d3ee","#f59e0b","#10b981","#f43f5e","#a78bfa"];

const REGIONS = [
  { key: "us",   label: "US",   flag: "🇺🇸", color: "#6366f1" },
  { key: "eu",   label: "EU",   flag: "🇪🇺", color: "#22d3ee" },
  { key: "jp",   label: "JP",   flag: "🇯🇵", color: "#f59e0b" },
  { key: "apac", label: "APAC", flag: "🌏", color: "#10b981" },
];

const sentColors: Record<string, string> = {
  Positive: "#10b981", Neutral: "#6366f1", Negative: "#f43f5e",
  positive: "#10b981", neutral: "#6366f1", negative: "#f43f5e",
};
const statusColors: Record<string, string> = {
  Engaged: "#10b981", Warm: "#f59e0b", Cold: "#f43f5e",
  "In Review": "#6366f1", Sent: "#22d3ee", Drafted: "#f59e0b",
  Ideation: "#94a3b8", High: "#f43f5e", Medium: "#f59e0b",
};

interface DashboardProps {
  initialInsights: any;
  initialCoverage: any[];
  initialMetrics:  any;
  generatedAt:     string | null;
  weekNumber:      number | null;
}

// ─── 静态数据 ────────────────────────────────────────────────
const defaultNarrativeData = [
  { narrative: "AI Work Companion",       current: 38, target: 70 },
  { narrative: "AI Note Taker",           current: 62, target: 40 },
  { narrative: "Conv. Intelligence",      current: 29, target: 65 },
  { narrative: "AI Productivity Tool",    current: 44, target: 50 },
  { narrative: "Capture→Extract→Utilize", current: 18, target: 60 },
];
const defaultTopics = [
  { topic: "AI Agents at Work",        relevance: 95, plaudIn: true,  evidence: "NotePin S launch article on TechCrunch" },
  { topic: "Ambient AI Hardware",      relevance: 88, plaudIn: true,  evidence: "CES 2026 coverage in The Verge & Wired"  },
  { topic: "Voice-First Productivity", relevance: 82, plaudIn: false, evidence: "" },
  { topic: "Meeting Intelligence",     relevance: 79, plaudIn: true,  evidence: "Plaud Desktop launch pitch to Forbes"    },
  { topic: "AI Work Companions",       relevance: 91, plaudIn: false, evidence: "" },
  { topic: "Human-AI Collaboration",   relevance: 85, plaudIn: false, evidence: "" },
];
const radarData = [
  { subject: "Tier-1 Media",         plaud: 55, otter: 70 },
  { subject: "Exec Quotes",          plaud: 40, otter: 30 },
  { subject: "Product Reviews",      plaud: 75, otter: 65 },
  { subject: "Thought Leadership",   plaud: 35, otter: 45 },
  { subject: "Social Amplification", plaud: 60, otter: 55 },
  { subject: "Narrative Control",    plaud: 42, otter: 50 },
];
const pitches = [
  { angle: "How Plaud captures lost meeting intelligence", outlet: "Fast Company", status: "Drafted",   priority: "High"   },
  { angle: "The AI Work Companion category is emerging",   outlet: "The Verge",    status: "Sent",      priority: "High"   },
  { angle: "Capture, Extract, Utilize: A new loop",        outlet: "Wired",        status: "In Review", priority: "High"   },
  { angle: "Why conversations are the new data source",    outlet: "HBR",          status: "Ideation",  priority: "Medium" },
  { angle: "Plaud vs reMarkable: different bets on AI",    outlet: "TechCrunch",   status: "Ideation",  priority: "Medium" },
];
const upcomingEvents = [
  { event: "TED AI 2026",           date: "Mar 18", opportunity: "Exec keynote pitch"      },
  { event: "SXSW Panels",           date: "Mar 14", opportunity: "Journalist meet & greet" },
  { event: "WSJ Tech Live",         date: "Apr 2",  opportunity: "CEO interview slot"       },
  { event: "Forbes AI 50 Deadline", date: "Mar 25", opportunity: "Nomination submission"   },
];
const businessMetrics = [
  { metric: "Organic Traffic from PR", value: "+24%",   trend: "up"   },
  { metric: "Brand Search Volume",     value: "+18%",   trend: "up"   },
  { metric: "Tier-1 Mentions (MoM)",  value: "+41%",   trend: "up"   },
  { metric: "Avg Sentiment Score",     value: "7.2/10", trend: "up"   },
  { metric: "Share of AI Voice",       value: "12%",    trend: "down" },
];

// ─── 小组件 ──────────────────────────────────────────────────
const StatusBadge = ({ s }: { s: string }) => (
  <span style={{ background:(statusColors[s]||"#94a3b8")+"22", color:statusColors[s]||"#94a3b8", border:`1px solid ${(statusColors[s]||"#94a3b8")}44`, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{s}</span>
);
const Card = ({ children, style={} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:20, ...style }}>{children}</div>
);
const CardTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ color:TEXT, fontWeight:700, fontSize:13, letterSpacing:"0.05em", textTransform:"uppercase" }}>{children}</div>
    {sub && <div style={{ color:MUTED, fontSize:11, marginTop:2 }}>{sub}</div>}
  </div>
);
const MetricTile = ({ label, value, trend, sub, highlight, color }: { label:string; value:string; trend?:string; sub?:string; highlight?:boolean; color?:string }) => (
  <div style={{ background:"#13151f", border:`1px solid ${highlight?(color||ACCENT)+"55":BORDER}`, borderRadius:10, padding:"14px 16px" }}>
    <div style={{ color:MUTED, fontSize:11, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
    <div style={{ color:color||TEXT, fontSize:22, fontWeight:800 }}>{value}</div>
    {trend && <div style={{ color:trend==="up"?"#10b981":"#f43f5e", fontSize:11, marginTop:2 }}>{trend==="up"?"▲":"▼"} {sub}</div>}
    {!trend && sub && <div style={{ color:MUTED, fontSize:11, marginTop:2 }}>{sub}</div>}
  </div>
);

// ─── CSV 解析 ─────────────────────────────────────────────────
function parseMeltwaterCSV(text: string): any[] {
  const lines = text.split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"));
  if (lines.length < 2) return [];
  const sep = lines[0].split("\t").length > 5 ? "\t" : ",";
  const headers = lines[0].split(sep).map(h=>h.replace(/"/g,"").trim());
  const rows: any[] = [];
  let i = 1;
  while (i < lines.length) {
    let line = lines[i];
    while (line.split(sep).length < headers.length && i+1 < lines.length) { i++; line = line+" "+lines[i].trim(); }
    const vals = line.split(sep).map(v=>v.replace(/^"|"$/g,"").trim());
    const obj: any = {};
    headers.forEach((h,idx)=>{ obj[h]=vals[idx]||""; });
    rows.push(obj); i++;
  }
  return rows;
}

function normalizeMeltwaterRow(row: any): any {
  const out: any = {};
  for (const [k,v] of Object.entries(row)) {
    const kl = k.toLowerCase().replace(/\s+/g,"");
    if (kl.includes("title"))                                     out.title  = v;
    else if (kl.includes("sourcename")||kl.includes("source")&&!kl.includes("type")&&!kl.includes("domain")) out.outlet = v;
    else if (kl.includes("sourcedomain")||kl.includes("domain"))  out.domain = v;
    else if (kl==="reach"||kl.includes("nationalreach")||kl.includes("globalreach")) {
      const num = parseFloat(String(v).replace(/,/g,""))||0;
      if (!out.reach||num>out.reach) out.reach = num;
    }
    else if (kl.includes("sentiment")) out.sentiment = String(v).toLowerCase();
    else if (kl.includes("date")&&!kl.includes("end")) out.date = v;
    else if (kl.includes("url")||kl==="link") out.url = v;
    else if (kl.includes("author")) out.author = v;
    else if (kl.includes("sourcetype")||kl.includes("type")) out.sourceType = v;
    else out[k] = v;
  }
  return out;
}

function parseGA4CSV(text: string): any[] {
  const lines = text.split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"));
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h=>h.replace(/"/g,"").trim());
  const rows: any[] = [];
  let i = 1;
  while (i < lines.length) {
    let line = lines[i];
    while (line.split(",").length < headers.length && i+1 < lines.length) { i++; line=line+" "+lines[i].trim(); }
    const vals = line.split(",").map(v=>v.replace(/"/g,"").trim());
    const obj: any = {};
    headers.forEach((h,idx)=>{ obj[h]=vals[idx]||""; });
    rows.push(obj); i++;
  }
  return rows;
}

function parseGoogleTrendsCSV(text: string): { chartData: any[]; keywords: string[] } {
  const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);
  const headerIdx = lines.findIndex(l=>l.startsWith("Day")||l.startsWith("Week")||l.startsWith("Month"));
  if (headerIdx===-1) return { chartData:[], keywords:[] };
  const headers = lines[headerIdx].split(",").map(h=>h.replace(/"/g,"").trim());
  const keywords = headers.slice(1).map(h=>h.replace(/:\s*\(.*?\)/g,"").trim());
  const chartData: any[] = [];
  for (let i=headerIdx+1; i<lines.length; i++) {
    const vals = lines[i].split(",").map(v=>v.replace(/"/g,"").trim());
    if (!vals[0]) continue;
    const point: any = { date: vals[0] };
    keywords.forEach((kw,idx)=>{ const raw=vals[idx+1]||"0"; point[kw]=raw==="<1"?0.5:(parseInt(raw)||0); });
    chartData.push(point);
  }
  return { chartData, keywords };
}

// ─── Narrative Ownership ─────────────────────────────────────
function NarrativeOwnershipCard() {
  const [data,setData]     = useState(defaultNarrativeData);
  const [editing,setEditing] = useState<{idx:number;field:"current"|"target"}|null>(null);
  const [editVal,setEditVal] = useState("");
  const startEdit = (idx:number,field:"current"|"target",val:number) => { setEditing({idx,field}); setEditVal(String(val)); };
  const commitEdit = () => {
    if (!editing) return;
    const num = Math.min(100,Math.max(0,parseInt(editVal)||0));
    const updated = [...data]; updated[editing.idx]={...updated[editing.idx],[editing.field]:num};
    setData(updated); setEditing(null);
  };
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <div style={{ color:TEXT, fontWeight:700, fontSize:13, letterSpacing:"0.05em", textTransform:"uppercase" }}>Plaud Narrative Ownership</div>
        <span style={{ background:ACCENT+"22", color:ACCENT, border:`1px solid ${ACCENT}44`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>Q1 2026</span>
      </div>
      <div style={{ color:MUTED, fontSize:11, marginBottom:10 }}>Current vs target narrative penetration</div>
      <div style={{ marginBottom:16, padding:"8px 12px", background:"#13151f", border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11, color:MUTED, lineHeight:1.8 }}>
        <div><span style={{color:ACCENT,fontWeight:600}}>Current %</span> = Media data (50%) + Team assessment (50%)</div>
        <div><span style={{color:MUTED,fontWeight:600}}>Target %</span> = Brand team's quarterly goal</div>
        <div style={{marginTop:4,color:"#f59e0b",fontSize:10}}>💡 Click any number to edit</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {data.map((row,idx)=>(
          <div key={row.narrative}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{color:TEXT,fontSize:12,fontWeight:600}}>{row.narrative}</span>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                {editing?.idx===idx&&editing?.field==="current"?(
                  <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commitEdit} onKeyDown={e=>e.key==="Enter"&&commitEdit()}
                    style={{width:48,background:BORDER,border:`1px solid ${ACCENT}`,borderRadius:4,color:TEXT,fontSize:12,fontWeight:700,textAlign:"center",padding:"2px 4px",outline:"none"}}/>
                ):(
                  <span onClick={()=>startEdit(idx,"current",row.current)} style={{color:ACCENT,fontSize:12,fontWeight:700,cursor:"pointer",borderBottom:`1px dashed ${ACCENT}55`}}>{row.current}%</span>
                )}
                <span style={{color:BORDER}}>/ target</span>
                {editing?.idx===idx&&editing?.field==="target"?(
                  <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commitEdit} onKeyDown={e=>e.key==="Enter"&&commitEdit()}
                    style={{width:48,background:BORDER,border:`1px solid ${MUTED}`,borderRadius:4,color:TEXT,fontSize:12,fontWeight:700,textAlign:"center",padding:"2px 4px",outline:"none"}}/>
                ):(
                  <span onClick={()=>startEdit(idx,"target",row.target)} style={{color:MUTED,fontSize:12,fontWeight:700,cursor:"pointer",borderBottom:`1px dashed ${MUTED}55`}}>{row.target}%</span>
                )}
              </div>
            </div>
            <div style={{position:"relative",height:8,background:BORDER,borderRadius:4}}>
              <div style={{position:"absolute",left:0,top:0,width:`${row.target}%`,height:"100%",background:"#2a2d3a",borderRadius:4}}/>
              <div style={{position:"absolute",left:0,top:0,width:`${row.current}%`,height:"100%",background:row.current>=row.target?"#10b981":ACCENT,borderRadius:4,transition:"width 0.3s"}}/>
            </div>
            <div style={{marginTop:4,fontSize:10,color:row.current>=row.target?"#10b981":"#f59e0b"}}>
              {row.current>=row.target?`✓ On track (${row.current-row.target}% above target)`:`△ ${row.target-row.current}% below target`}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Journalist Tracker ──────────────────────────────────────
function JournalistTracker({ coverage }: { coverage: any[] }) {
  const plaudArticles = coverage.filter(a=>(a.co||a.company)==="Plaud"&&a.journalist&&a.journalist!=="Staff");
  const autoJournalists = Array.from(plaudArticles.reduce((map,a)=>{
    if (!map.has(a.journalist)) map.set(a.journalist,{name:a.journalist,outlet:a.outlet,articles:[]});
    map.get(a.journalist).articles.push(a.title); return map;
  },new Map()).values()) as any[];
  const [manualList,setManualList] = useState([
    {name:"Casey Newton",outlet:"The Verge",beat:"AI Work Companion",tier:"Tier 1"},
    {name:"Nitasha Tiku",outlet:"Washington Post",beat:"Conv. Intelligence",tier:"Tier 1"},
    {name:"Will Knight",outlet:"Wired",beat:"AI Productivity",tier:"Tier 1"},
    {name:"Steven Levy",outlet:"Wired",beat:"Future of Work",tier:"Tier 1"},
  ]);
  const [showAdd,setShowAdd] = useState(false);
  const [newJ,setNewJ] = useState({name:"",outlet:"",beat:"",tier:"Tier 1"});
  const [aiRecs,setAiRecs] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);
  const [sending,  setSending]  = useState(false);
const [sendMsg,  setSendMsg]  = useState<string|null>(null);
const sendReport = async () => {
  setSending(true); setSendMsg(null);
  try {
    const res  = await fetch("/api/send-weekly-report", { method:"POST", headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    if (data.ok) setSendMsg("✓ Report sent to elina@plaud.ai and cher@plaud.ai");
    else setSendMsg("✗ Failed to send: " + JSON.stringify(data.error));
  } catch { setSendMsg("✗ Network error"); }
  setSending(false);
};
  const addJournalist = () => {
    if (!newJ.name||!newJ.outlet) return;
    setManualList(prev=>[...prev,newJ]); setNewJ({name:"",outlet:"",beat:"",tier:"Tier 1"}); setShowAdd(false);
  };
  const generateRecs = async () => {
    setLoading(true);
    try {
      const allJ=[...autoJournalists.map(j=>`${j.name} (${j.outlet}) — reported on Plaud: "${j.articles[0]?.slice(0,60)}"`),
        ...manualList.map(j=>`${j.name} (${j.outlet}) — beat: ${j.beat}`)].join("\n");
      const res = await fetch("/api/insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({journalistMode:true,journalists:allJ})});
      const data = await res.json();
      if (data.journalistRecs) setAiRecs(data.journalistRecs);
    } catch {}
    setLoading(false);
  };
  const priColors: Record<string,string> = {High:"#f43f5e",Medium:"#f59e0b",Low:"#10b981"};
  return (
    <div style={{display:"grid",gap:16}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Journalists Who Covered Plaud</div>
          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Auto-detected from Tier 1 Coverage</div></div>
          <span style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:6,padding:"2px 10px",color:"#10b981",fontSize:11,fontWeight:700}}>{autoJournalists.length} found</span>
        </div>
        {autoJournalists.length===0?(
          <div style={{color:MUTED,fontSize:12,padding:"16px 0",textAlign:"center"}}>No journalist data yet — Tier 1 Coverage will auto-populate this section</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {autoJournalists.map((j:any)=>(
              <div key={j.name} style={{background:"#13151f",border:`1px solid ${ACCENT}33`,borderRadius:8,padding:"10px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div><span style={{color:TEXT,fontSize:12,fontWeight:700}}>{j.name}</span><span style={{color:MUTED,fontSize:11}}> · {j.outlet}</span></div>
                  <span style={{background:"#10b98122",color:"#10b981",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:600}}>Has covered Plaud</span>
                </div>
                <div style={{color:MUTED,fontSize:11}}>"{j.articles[0]?.slice(0,80)}..."</div>
                {j.articles.length>1&&<div style={{color:ACCENT,fontSize:10,marginTop:2}}>+{j.articles.length-1} more articles</div>}
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Journalist Library</div>
          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Manually curated — journalists worth pitching</div></div>
          <button onClick={()=>setShowAdd(!showAdd)} style={{background:ACCENT,color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Add</button>
        </div>
        {showAdd&&(
          <div style={{background:"#13151f",border:`1px solid ${ACCENT}44`,borderRadius:8,padding:14,marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 60px",gap:8,alignItems:"end"}}>
            {[{label:"Name",key:"name",placeholder:"e.g. Lauren Goode"},{label:"Outlet",key:"outlet",placeholder:"e.g. Wired"},{label:"Beat",key:"beat",placeholder:"e.g. AI Hardware"}].map(f=>(
              <div key={f.key}><div style={{color:MUTED,fontSize:10,marginBottom:4}}>{f.label}</div>
              <input value={(newJ as any)[f.key]} onChange={e=>setNewJ(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                style={{width:"100%",background:BORDER,border:`1px solid ${BORDER}`,borderRadius:6,padding:"6px 8px",color:TEXT,fontSize:11,outline:"none"}}/></div>
            ))}
            <button onClick={addJournalist} style={{background:ACCENT,color:"#fff",border:"none",borderRadius:6,padding:"7px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Save</button>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {manualList.map((j,i)=>(
            <div key={i} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><span style={{color:TEXT,fontSize:12,fontWeight:700}}>{j.name}</span><span style={{color:MUTED,fontSize:11}}> · {j.outlet}</span>
              <span style={{background:BORDER,color:MUTED,borderRadius:4,padding:"1px 6px",fontSize:10,marginLeft:8}}>{j.tier}</span>
              <div style={{color:MUTED,fontSize:11,marginTop:3}}>Beat: {j.beat}</div></div>
              <button onClick={()=>setManualList(prev=>prev.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:"#f43f5e",cursor:"pointer",fontSize:18,padding:"0 4px"}}>×</button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Pitch Recommendations</div>
          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Based on Plaud's narrative needs + journalist profiles</div></div>
          <button onClick={generateRecs} disabled={loading} style={{background:loading?BORDER:"linear-gradient(135deg,#6366f1,#22d3ee)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:11,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1}}>
            {loading?"Generating...":"⚡ Generate Pitch Recs"}
          </button>
        </div>
        {aiRecs.length===0&&!loading&&(<div style={{textAlign:"center",padding:"24px 0",color:MUTED}}><div style={{fontSize:28,marginBottom:8}}>🎯</div><div style={{fontSize:12}}>Click "Generate Pitch Recs" to get AI-powered recommendations.</div></div>)}
        {loading&&<div style={{textAlign:"center",padding:"24px 0",color:MUTED,fontSize:12}}>Analyzing journalist profiles...</div>}
        {aiRecs.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {aiRecs.map((rec:any,i:number)=>(
              <div key={i} style={{background:"#13151f",border:`1px solid ${(priColors[rec.priority]||BORDER)}33`,borderRadius:8,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div><span style={{color:TEXT,fontSize:13,fontWeight:700}}>{rec.name}</span><span style={{color:MUTED,fontSize:11}}> · {rec.outlet}</span></div>
                  <span style={{background:(priColors[rec.priority]||MUTED)+"22",color:priColors[rec.priority]||MUTED,border:`1px solid ${(priColors[rec.priority]||MUTED)}44`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>{rec.priority} Priority</span>
                </div>
                <div style={{color:CYAN,fontSize:11,fontWeight:600,marginBottom:4}}>Pitch angle: {rec.angle}</div>
                <div style={{color:MUTED,fontSize:11}}>{rec.reason}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Pulse ───────────────────────────────────────────────────
function PulseModule({
  regionData, onRegionLoad, regionPrevData
}: {
  regionData: Record<string, { rows: any[]; date: string | null }>;
  onRegionLoad: (region: string, rows: any[], date: string) => void;
  regionPrevData: Record<string, { rows: any[]; date: string | null }>;
}) {
  const [dragging, setDragging] = useState<string|null>(null);

  const handleFile = (region: string, file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const raw  = parseMeltwaterCSV(text);
      if (!raw.length) return;
      const norm = raw.map(normalizeMeltwaterRow);
      const date = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
      onRegionLoad(region, norm, date);
    };
    reader.readAsText(file);
  };

  const getStats = (rows: any[]) => {
    const tier1 = rows.filter(r=>(r.reach||0)>=1000000);
    const pos   = rows.filter(r=>(r.sentiment||"").includes("pos")).length;
    const neg   = rows.filter(r=>(r.sentiment||"").includes("neg")).length;
    return { total: rows.length, tier1: tier1.length, pos, neg };
  };

  const hasAnyData = REGIONS.some(r => regionData[r.key]?.rows?.length > 0);

  return (
    <div style={{display:"grid",gap:16}}>
      {!hasAnyData && (
        <div style={{padding:"8px 14px",background:"#f59e0b11",border:"1px solid #f59e0b33",borderRadius:8,fontSize:11,color:"#f59e0b"}}>
          ⚠ No data uploaded yet — upload regional Meltwater CSVs below to see real metrics
        </div>
      )}

      {/* ── Weekly Mentions ── */}
      <div>
        <div style={{color:TEXT,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Weekly Mentions by Region</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
         {REGIONS.map(r => {
  const d     = regionData[r.key];
  const prev  = regionPrevData[r.key];
  const hasData = d?.rows?.length > 0;
  const stats   = hasData ? getStats(d.rows) : null;
  const prevStats = prev?.rows?.length > 0 ? getStats(prev.rows) : null;
  const wow = stats && prevStats ? Math.round(((stats.total - prevStats.total) / prevStats.total) * 100) : null;
  return (
    <MetricTile key={r.key}
      label={`${r.flag} ${r.label} Weekly Mentions`}
      value={hasData ? String(stats!.total) : "—"}
      trend={wow !== null ? (wow >= 0 ? "up" : "down") : undefined}
      sub={wow !== null ? `${wow >= 0 ? "+" : ""}${wow}% vs last week` : (hasData ? `Uploaded ${d.date}` : "No data")}
      highlight={hasData}
      color={r.color}
    />
  );
})}
        </div>
      </div>

      {/* ── Tier 1 Coverage ── */}
      <div>
        <div style={{color:TEXT,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Tier 1 Coverage by Region</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {REGIONS.map(r => {
            const d = regionData[r.key];
            const hasData = d?.rows?.length > 0;
            const stats = hasData ? getStats(d.rows) : null;
            return (
              <MetricTile key={r.key}
                label={`${r.flag} ${r.label} Tier 1`}
                value={hasData ? String(stats!.tier1) : "—"}
                sub={hasData ? "Reach >1M" : "No data"}
                highlight={hasData}
                color={r.color}
              />
            );
          })}
        </div>
      </div>

      {/* ── Sentiment per region ── */}
      {hasAnyData && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {REGIONS.map(r => {
            const d = regionData[r.key];
            const hasData = d?.rows?.length > 0;
            if (!hasData) return null;
            const stats = getStats(d.rows);
            const posRatio = stats.total > 0 ? Math.round((stats.pos/stats.total)*100) : 0;
            return (
              <div key={r.key} style={{background:"#13151f",border:`1px solid ${r.color}33`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{color:r.color,fontSize:11,fontWeight:700,marginBottom:8}}>{r.flag} {r.label} Sentiment</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,fontSize:11}}>
                  <div><div style={{color:"#10b981",fontWeight:700}}>{stats.pos}</div><div style={{color:MUTED,fontSize:9}}>POS</div></div>
                  <div><div style={{color:"#f43f5e",fontWeight:700}}>{stats.neg}</div><div style={{color:MUTED,fontSize:9}}>NEG</div></div>
                  <div><div style={{color:ACCENT,fontWeight:700}}>{posRatio}%</div><div style={{color:MUTED,fontSize:9}}>+VE</div></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Business Impact ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardTitle sub="PR contribution to business">Business Impact Metrics</CardTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {businessMetrics.map(m=>(
              <div key={m.metric} style={{background:"#13151f",borderRadius:8,padding:"10px 12px",border:`1px solid ${BORDER}`}}>
                <div style={{color:MUTED,fontSize:10,textTransform:"uppercase"}}>{m.metric}</div>
                <div style={{color:m.trend==="up"?"#10b981":"#f43f5e",fontSize:18,fontWeight:700,marginTop:2}}>{m.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sentiment Score */}
        <Card>
          <CardTitle sub="Combined sentiment across all regions">Overall Sentiment Score</CardTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {REGIONS.map(r => {
              const d = regionData[r.key];
              const hasData = d?.rows?.length > 0;
              const stats = hasData ? getStats(d.rows) : null;
              const score = stats && stats.total > 0
                ? ((stats.pos*10 + (stats.total-stats.pos-stats.neg)*5) / (stats.total*10) * 10).toFixed(1)
                : null;
              return (
                <div key={r.key} style={{background:"#13151f",borderRadius:8,padding:"10px 12px",border:`1px solid ${r.color}33`}}>
                  <div style={{color:r.color,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{r.flag} {r.label}</div>
                  <div style={{color:TEXT,fontSize:20,fontWeight:800,marginTop:2}}>{score ? `${score}/10` : "—"}</div>
                  <div style={{color:MUTED,fontSize:10}}>Sentiment score</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Upload区域（底部）── */}
      <Card>
        <CardTitle sub="Upload one CSV per region — data persists until you upload a new file">Upload Regional Meltwater CSVs</CardTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {REGIONS.map(r => {
            const d = regionData[r.key];
            const hasData = d?.rows?.length > 0;
            const inputId = `pulse-mw-${r.key}`;
            return (
              <div key={r.key}
                onDragOver={e=>{e.preventDefault();setDragging(r.key);}}
                onDragLeave={()=>setDragging(null)}
                onDrop={e=>{ e.preventDefault(); setDragging(null); Array.from(e.dataTransfer.files).forEach(f=>handleFile(r.key,f)); }}
                onClick={()=>document.getElementById(inputId)?.click()}
                style={{border:`2px dashed ${dragging===r.key?r.color:hasData?r.color+"55":BORDER}`,borderRadius:10,padding:"16px 12px",textAlign:"center",background:dragging===r.key?r.color+"11":hasData?r.color+"08":"#13151f",transition:"all 0.15s",cursor:"pointer"}}
              >
                <div style={{fontSize:22,marginBottom:6}}>{r.flag}</div>
                <div style={{color:r.color,fontSize:12,fontWeight:700,marginBottom:2}}>{r.label}</div>
                {hasData ? (
                  <>
                    <div style={{color:"#10b981",fontSize:10,marginBottom:2}}>✓ {d.rows.length} mentions</div>
                    <div style={{color:MUTED,fontSize:9}}>{d.date}</div>
                    <div style={{color:MUTED,fontSize:9,marginTop:4}}>Click to update</div>
                  </>
                ) : (
                  <div style={{color:MUTED,fontSize:10}}>Drop CSV or click</div>
                )}
                <input id={inputId} type="file" accept=".csv" style={{display:"none"}}
                  onChange={e=>Array.from(e.target.files||[]).forEach(f=>handleFile(r.key,f))}/>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,padding:"8px 12px",background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,fontSize:11,color:MUTED,lineHeight:1.8}}>
          <div style={{color:TEXT,fontWeight:600,marginBottom:4}}>How to export from Meltwater by region:</div>
          <div>1. Search <strong style={{color:ACCENT}}>"Plaud"</strong> → Set date range → Add filter <strong style={{color:CYAN}}>Country/Region</strong></div>
          <div>2. Export one CSV per region (US / EU / JP / APAC)</div>
          <div>3. Upload each CSV to the corresponding region above</div>
        </div>
      </Card>
    </div>
  );
}

// ─── Narrative ───────────────────────────────────────────────
function NarrativeModule() {
  const [topics,setTopics] = useState(defaultTopics);
  const [industryData,setIndustryData] = useState<any>(null);
  const [industryLoading,setIndustryLoading] = useState(true);
  const [thoughtData,setThoughtData] = useState<any>(null);
  const [thoughtLoading,setThoughtLoading] = useState(true);

  useState(()=>{
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/narrative-insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"industry"})});
        const data = await res.json();
        if (!data.error) setIndustryData(data);
      } catch {}
      setIndustryLoading(false);
      try {
        const res = await fetch("/api/narrative-insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"thought"})});
        const data = await res.json();
        if (!data.error) setThoughtData(data);
      } catch {}
      setThoughtLoading(false);
    };
    fetchAll();
  });

  const refresh = async (mode:"industry"|"thought") => {
    if (mode==="industry") setIndustryLoading(true); else setThoughtLoading(true);
    try {
      const res = await fetch("/api/narrative-insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,forceRefresh:true})});
      const data = await res.json();
      if (!data.error) { if (mode==="industry") setIndustryData(data); else setThoughtData(data); }
    } catch {}
    if (mode==="industry") setIndustryLoading(false); else setThoughtLoading(false);
  };

  const sentimentColors: Record<string,string> = {opportunity:"#10b981",risk:"#f43f5e",neutral:"#6366f1"};
  const categoryColors: Record<string,string> = {"Enterprise AI":"#6366f1","Consumer AI":"#22d3ee","AI Hardware":"#f59e0b","Regional Trends":"#10b981"};

  return (
    <div style={{display:"grid",gap:16}}>
    

      {/* Industry Insights */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Industry Insights</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>{industryData?.fromCache?"Cached · updated monthly":industryData?.generatedAt?`Generated ${industryData.generatedAt}`:"Market research · updated monthly"}</div>
          </div>
          <button onClick={()=>refresh("industry")} disabled={industryLoading}
            style={{background:industryLoading?BORDER:"linear-gradient(135deg,#6366f1,#22d3ee)",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:industryLoading?"not-allowed":"pointer",opacity:industryLoading?0.7:1}}>
            {industryLoading?"Loading...":"↻ Refresh"}
          </button>
        </div>
        {industryLoading&&<div style={{textAlign:"center",padding:"32px 0",color:MUTED}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><div style={{fontSize:12}}>Loading AI industry insights...</div></div>}
        {!industryLoading&&!industryData&&<div style={{textAlign:"center",padding:"24px 0",color:MUTED,fontSize:12}}>Failed to load. Click Refresh to try again.</div>}
        {!industryLoading&&industryData&&(
          <div style={{display:"grid",gap:12}}>
            <div style={{background:"linear-gradient(135deg,#6366f122,#22d3ee11)",border:"1px solid #6366f144",borderRadius:10,padding:"12px 16px"}}>
              <div style={{color:CYAN,fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Big Picture</div>
              <div style={{color:TEXT,fontSize:13,fontWeight:600,lineHeight:1.5}}>{industryData.headline}</div>
              <div style={{color:MUTED,fontSize:12,marginTop:6,lineHeight:1.6}}>{industryData.bigPicture}</div>
            </div>
            <div style={{background:"#10b98111",border:"1px solid #10b98133",borderRadius:8,padding:"10px 14px"}}>
              <div style={{color:"#10b981",fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Plaud Opportunity</div>
              <div style={{color:TEXT,fontSize:12}}>{industryData.plaudOpportunity}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {(industryData.reports||[]).map((r:any,i:number)=>(
                <div key={i} style={{background:"#13151f",border:`1px solid ${(categoryColors[r.category]||BORDER)}33`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{color:TEXT,fontSize:12,fontWeight:600,lineHeight:1.3,flex:1,marginRight:8}}>{r.title}</div>
                    <span style={{background:(categoryColors[r.category]||MUTED)+"22",color:categoryColors[r.category]||MUTED,borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>{r.category}</span>
                  </div>
                  <div style={{color:MUTED,fontSize:10,marginBottom:6}}>
                    {r.url?<a href={r.url} target="_blank" rel="noopener noreferrer" style={{color:CYAN,textDecoration:"none"}}>{r.source}</a>:r.source} · {r.date}
                  </div>
                  <div style={{color:TEXT,fontSize:11,lineHeight:1.5,marginBottom:6}}>{r.keyFinding}</div>
                  <div style={{color:CYAN,fontSize:10,borderTop:`1px solid ${BORDER}`,paddingTop:6}}>→ {r.relevanceToPlaud}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Thought Leaders */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Thought Leaders This Week</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>{thoughtData?.fromCache?"Cached · updated weekly":thoughtData?.generatedAt?`Generated ${thoughtData.generatedAt}`:"Hot AI opinions & debates · updated weekly"}</div>
          </div>
          <button onClick={()=>refresh("thought")} disabled={thoughtLoading}
            style={{background:thoughtLoading?BORDER:"linear-gradient(135deg,#6366f1,#22d3ee)",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:thoughtLoading?"not-allowed":"pointer",opacity:thoughtLoading?0.7:1}}>
            {thoughtLoading?"Loading...":"↻ Refresh"}
          </button>
        </div>
        {thoughtLoading&&<div style={{textAlign:"center",padding:"32px 0",color:MUTED}}><div style={{fontSize:28,marginBottom:8}}>💬</div><div style={{fontSize:12}}>Loading thought leader opinions...</div></div>}
        {!thoughtLoading&&!thoughtData&&<div style={{textAlign:"center",padding:"24px 0",color:MUTED,fontSize:12}}>Failed to load. Click Refresh to try again.</div>}
        {!thoughtLoading&&thoughtData&&(
          <div style={{display:"grid",gap:12}}>
            {thoughtData.hotDebate&&(
              <div style={{background:"#f43f5e11",border:"1px solid #f43f5e33",borderRadius:8,padding:"10px 14px"}}>
                <div style={{color:"#f43f5e",fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>🔥 Hot Debate Right Now</div>
                <div style={{color:TEXT,fontSize:12,lineHeight:1.5}}>{thoughtData.hotDebate}</div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {(thoughtData.leaders||[]).map((l:any,i:number)=>(
                <div key={i} style={{background:"#13151f",border:`1px solid ${(sentimentColors[l.sentiment]||BORDER)}33`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div><div style={{color:TEXT,fontSize:12,fontWeight:700}}>{l.name}</div><div style={{color:MUTED,fontSize:10}}>{l.title}</div></div>
                    <span style={{background:(sentimentColors[l.sentiment]||MUTED)+"22",color:sentimentColors[l.sentiment]||MUTED,borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>{l.sentiment}</span>
                  </div>
                  <div style={{color:CYAN,fontSize:11,fontStyle:"italic",marginBottom:6,lineHeight:1.5}}>"{l.quote}"</div>
                  <div style={{color:MUTED,fontSize:10,marginBottom:6}}>
                    {l.url?<a href={l.url} target="_blank" rel="noopener noreferrer" style={{color:CYAN,textDecoration:"none"}}>{l.source}</a>:l.source} · {l.date}
                  </div>
                  <div style={{color:"#10b981",fontSize:10,borderTop:`1px solid ${BORDER}`,paddingTop:6}}>→ {l.relevanceToPlaud}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Narrative Landscape */}
      <Card>
        <div style={{marginBottom:16}}>
          <div style={{color:TEXT,fontWeight:700,fontSize:13,letterSpacing:"0.05em",textTransform:"uppercase"}}>AI Industry Narrative Landscape</div>
          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Which AI stories are breaking — and is Plaud in them?</div>
          <div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:6,background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"6px 12px"}}>
            <span style={{color:"#10b981",fontSize:11,fontWeight:700}}>IN</span><span style={{color:MUTED,fontSize:11}}>=</span>
            <span style={{color:MUTED,fontSize:11}}>Plaud has actively published content on this topic</span>
            <span style={{color:MUTED,fontSize:11,margin:"0 4px"}}>·</span>
            <span style={{color:"#f43f5e",fontSize:11,fontWeight:700}}>OUT</span><span style={{color:MUTED,fontSize:11}}>=</span>
            <span style={{color:MUTED,fontSize:11}}>Not yet covered — pitch opportunity</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {topics.map((t,idx)=>(
            <div key={t.topic} style={{background:"#13151f",border:`1px solid ${t.plaudIn?ACCENT+"55":BORDER}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{color:TEXT,fontSize:12,fontWeight:600,lineHeight:1.3}}>{t.topic}</span>
                <button onClick={()=>{const u=[...topics];u[idx]={...u[idx],plaudIn:!u[idx].plaudIn};setTopics(u);}}
                  style={{color:t.plaudIn?"#10b981":"#f43f5e",fontSize:10,fontWeight:700,whiteSpace:"nowrap",marginLeft:6,background:"none",border:"none",cursor:"pointer",padding:0}}>
                  {t.plaudIn?"✓ IN":"✗ OUT"}
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{flex:1,background:BORDER,borderRadius:4,height:4}}>
                  <div style={{width:`${t.relevance}%`,background:t.plaudIn?ACCENT:MUTED,borderRadius:4,height:4}}/>
                </div>
                <span style={{color:MUTED,fontSize:10}}>{t.relevance}</span>
              </div>
              {t.plaudIn?(
                <input placeholder="Add evidence..." defaultValue={t.evidence}
                  onBlur={e=>{const u=[...topics];u[idx]={...u[idx],evidence:e.target.value};setTopics(u);}}
                  style={{width:"100%",background:BORDER,border:"none",borderRadius:4,padding:"4px 6px",color:TEXT,fontSize:10,outline:"none"}}/>
              ):(
                <div style={{color:"#f59e0b",fontSize:10}}>⚡ Pitch opportunity</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Competitive ─────────────────────────────────────────────
function CompetitiveModule() {
  return (
    <div style={{display:"grid",gap:16}}><NarrativeOwnershipCard />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardTitle sub="Plaud vs Otter.ai across PR dimensions">Competitive Radar</CardTitle>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={BORDER}/>
              <PolarAngleAxis dataKey="subject" stroke={MUTED} fontSize={10}/>
              <Radar name="Plaud"    dataKey="plaud" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25}/>
              <Radar name="Otter.ai" dataKey="otter" stroke={CYAN}   fill={CYAN}   fillOpacity={0.15}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle sub="This week's competitive signals">Competitor Intelligence</CardTitle>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {co:"Otter.ai",  signal:"Launched enterprise plan — 3 Tier-1 pieces in WSJ, Bloomberg",impact:"High",       color:"#f43f5e"},
              {co:"Notion AI", signal:"CEO op-ed in HBR on AI for knowledge workers",                 impact:"High",       color:"#f43f5e"},
              {co:"reMarkable",signal:"Product review cycle in The Verge — physical device framing",  impact:"Low",        color:"#10b981"},
              {co:"Humane AI", signal:"Negative press cycle — AI wearables overpromise",              impact:"Opportunity",color:"#f59e0b"},
            ].map(c=>(
              <div key={c.co} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:CYAN,fontSize:12,fontWeight:700}}>{c.co}</span>
                  <span style={{color:c.color,fontSize:10,fontWeight:600}}>{c.impact}</span>
                </div>
                <div style={{color:MUTED,fontSize:11}}>{c.signal}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Action ──────────────────────────────────────────────────
function ActionModule({ coverage }: { coverage: any[] }) {
  return (
    <div style={{display:"grid",gap:16}}>
      <JournalistTracker coverage={coverage}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardTitle sub="Active story pitches in pipeline">Pitch Opportunity Pipeline</CardTitle>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pitches.map(p=>(
              <div key={p.angle} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:CYAN,fontSize:11,fontWeight:600}}>{p.outlet}</span>
                  <div style={{display:"flex",gap:6}}><StatusBadge s={p.priority}/><StatusBadge s={p.status}/></div>
                </div>
                <div style={{color:TEXT,fontSize:12}}>{p.angle}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle sub="Next 30 days">Upcoming Media Opportunities</CardTitle>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {upcomingEvents.map(e=>(
              <div key={e.event} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{background:ACCENT+"22",border:`1px solid ${ACCENT}44`,borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:50}}>
                  <div style={{color:ACCENT,fontSize:11,fontWeight:700}}>{e.date}</div>
                </div>
                <div>
                  <div style={{color:TEXT,fontSize:12,fontWeight:600}}>{e.event}</div>
                  <div style={{color:"#10b981",fontSize:11}}>→ {e.opportunity}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle sub="CEO & founder narrative positioning">Executive Narrative Opportunities</CardTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {quote:"Conversation is the most underutilized source of professional intelligence.",use:"Op-ed hook / keynote opener",fit:"High"},
            {quote:"We're building the work companion that never forgets, never misses a signal.",use:"Product launch narrative",fit:"High"},
            {quote:"The next frontier of AI isn't chat. It's capturing what humans say in rooms.",use:"Investor/media interviews",fit:"Medium"},
          ].map(q=>(
            <div key={q.quote} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{color:TEXT,fontSize:12,fontStyle:"italic",marginBottom:6}}>"{q.quote}"</div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:MUTED,fontSize:11}}>{q.use}</span>
                <StatusBadge s={q.fit}/>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── AI Insights ─────────────────────────────────────────────
function AIInsightsModule({ initialInsights, generatedAt, weekNumber }: { initialInsights:any; generatedAt:string|null; weekNumber:number|null }) {
  const [insights,setInsights] = useState<any>(initialInsights);
  const [loading,setLoading]   = useState(false);
  const [sending,  setSending]  = useState(false);
const [sendMsg,  setSendMsg]  = useState<string|null>(null);
const sendReport = async () => {
  setSending(true); setSendMsg(null);
  try {
    const res  = await fetch("/api/send-weekly-report", { method:"POST", headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    if (data.ok) setSendMsg("✓ Report sent to elina@plaud.ai and cher@plaud.ai");
    else setSendMsg("✗ Failed to send: " + JSON.stringify(data.error));
  } catch { setSendMsg("✗ Network error"); }
  setSending(false);
};
  const generate = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});
      const data = await res.json();
      if (!data.error) setInsights(data);
    } catch {}
    setLoading(false);
  };
  return (
    <div style={{display:"grid",gap:16}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Weekly Intelligence Brief</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>
              {generatedAt?`Last updated: ${new Date(generatedAt).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · Week ${weekNumber}`:"Auto-updates every Thursday 09:00 CST"}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
  <button onClick={generate} disabled={loading} style={{ background:loading?BORDER:"linear-gradient(135deg,#6366f1,#22d3ee)", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
    {loading?"Analyzing...":"Generate Brief"}
  </button>
  <button onClick={sendReport} disabled={sending} style={{ background:sending?BORDER:"#10b981", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, cursor:sending?"not-allowed":"pointer", opacity:sending?0.7:1 }}>
    {sending?"Sending...":"📧 Send Weekly Report"}
  </button>
</div>
        </div>
        {!insights&&!loading&&(<div style={{textAlign:"center",padding:"40px 0",color:MUTED}}><div style={{fontSize:32,marginBottom:8}}>🧠</div><div style={{fontSize:13}}>Click "Generate Brief" to start.</div></div>)}
        {loading&&<div style={{textAlign:"center",padding:"40px 0",color:MUTED,fontSize:13}}>Analyzing PR data...</div>}
        {insights&&!loading&&(
          <div style={{display:"grid",gap:14}}>
            <div style={{background:"linear-gradient(135deg,#6366f122,#22d3ee11)",border:"1px solid #6366f144",borderRadius:10,padding:14}}>
              <div style={{color:CYAN,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Executive Summary</div>
              <div style={{color:TEXT,fontSize:13,lineHeight:1.6}}>{insights.summary}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {(insights.insights||[]).map((ins:string,i:number)=>(
                <div key={i} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{color:ACCENT,fontSize:10,fontWeight:700,marginBottom:4}}>INSIGHT {i+1}</div>
                  <div style={{color:TEXT,fontSize:12,lineHeight:1.5}}>{ins}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#f43f5e11",border:"1px solid #f43f5e33",borderRadius:8,padding:"10px 12px"}}>
                <div style={{color:"#f43f5e",fontSize:10,fontWeight:700,marginBottom:4}}>NARRATIVE RISK</div>
                <div style={{color:TEXT,fontSize:12}}>{insights.risk}</div>
              </div>
              <div style={{background:"#10b98111",border:"1px solid #10b98133",borderRadius:8,padding:"10px 12px"}}>
                <div style={{color:"#10b981",fontSize:10,fontWeight:700,marginBottom:4}}>TOP OPPORTUNITY</div>
                <div style={{color:TEXT,fontSize:12}}>{insights.opportunity}</div>
              </div>
            </div>
            <div style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:10,padding:14}}>
              <div style={{color:TEXT,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Weekly Action Checklist</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {(insights.actions||[]).map((a:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{width:20,height:20,border:`2px solid ${ACCENT}`,borderRadius:4,flexShrink:0,marginTop:1}}/>
                    <span style={{color:TEXT,fontSize:12,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {sendMsg && (
  <div style={{ marginTop:12, padding:"8px 14px", background:sendMsg.startsWith("✓")?"#10b98111":"#f43f5e11", border:`1px solid ${sendMsg.startsWith("✓")?"#10b98133":"#f43f5e33"}`, borderRadius:8, fontSize:11, color:sendMsg.startsWith("✓")?"#10b981":"#f43f5e" }}>
    {sendMsg}
  </div>
)}
      </Card>
    </div>
  );
}

// ─── Tier 1 Coverage ────────────────────────────────────────
function Tier1Module({ onMeltwaterLoad, mwRows, uploadedAt }: {
  onMeltwaterLoad: (rows:any[],date:string)=>void; mwRows:any[]; uploadedAt:string|null;
}) {
  const [dragging,setDragging] = useState(false);
  const [filter,setFilter]     = useState("All");

  const handleFile = (file:File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const raw  = parseMeltwaterCSV(text);
      if (!raw.length) return;
      const norm = raw.map(normalizeMeltwaterRow);
      const date = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
      onMeltwaterLoad(norm,date);
    };
    reader.readAsText(file);
  };

  const tier1Rows  = mwRows.filter(r=>(r.reach||0)>=1000000);
  const sentFilters = ["All","Positive","Neutral","Negative"];
  const filtered   = filter==="All"?tier1Rows:tier1Rows.filter(r=>(r.sentiment||"").toLowerCase().includes(filter.toLowerCase()));
  const pos = tier1Rows.filter(r=>(r.sentiment||"").toLowerCase().includes("pos")).length;
  const neg = tier1Rows.filter(r=>(r.sentiment||"").toLowerCase().includes("neg")).length;
  const neu = tier1Rows.length-pos-neg;

  return (
    <div style={{display:"grid",gap:16}}>
 
      {tier1Rows.length===0&&(
        <Card><div style={{textAlign:"center",padding:"32px 0",color:MUTED}}>
          <div style={{fontSize:36,marginBottom:12}}>📰</div>
          <div style={{fontSize:13,fontWeight:600,marginBottom:6,color:TEXT}}>No Tier 1 coverage data yet</div>
          <div style={{fontSize:12}}>Upload a Meltwater CSV above to see articles with Reach &gt;1M</div>
        </div></Card>
      )}
      {tier1Rows.length>0&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            <MetricTile label="Tier 1 Articles" value={String(tier1Rows.length)} sub="Reach >1M"/>
            <MetricTile label="Positive"        value={String(pos)} trend="up"   sub={`${Math.round((pos/tier1Rows.length)*100)}% of total`}/>
            <MetricTile label="Negative"        value={String(neg)} trend="down" sub={`${Math.round((neg/tier1Rows.length)*100)}% of total`}/>
            <MetricTile label="Total Mentions"  value={String(mwRows.length)}    sub="All reach levels"/>
          </div>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <CardTitle sub={`Showing ${filtered.length} articles · Reach >1M · from Meltwater`}>Coverage Log</CardTitle>
              <div style={{display:"flex",gap:6}}>
                {sentFilters.map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    style={{background:filter===f?(f==="Positive"?"#10b981":f==="Negative"?"#f43f5e":f==="Neutral"?"#6366f1":ACCENT):BORDER,color:filter===f?"#fff":MUTED,border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:500,overflowY:"auto"}}>
              {filtered.length===0&&<div style={{color:MUTED,fontSize:12,textAlign:"center",padding:"20px 0"}}>No articles match this filter</div>}
              {filtered.map((item,i)=>(
                <div key={i} style={{background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{flex:1,marginRight:12}}>
                      {item.url?(
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          style={{color:TEXT,fontSize:12,fontWeight:600,textDecoration:"none",lineHeight:1.4}}
                          onMouseEnter={e=>(e.target as HTMLElement).style.color=CYAN}
                          onMouseLeave={e=>(e.target as HTMLElement).style.color=TEXT}>
                          {item.title||"Untitled"}
                        </a>
                      ):(
                        <div style={{color:TEXT,fontSize:12,fontWeight:600,lineHeight:1.4}}>{item.title||"Untitled"}</div>
                      )}
                    </div>
                    <span style={{color:sentColors[item.sentiment||"neutral"]||MUTED,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
                      {item.sentiment?item.sentiment.charAt(0).toUpperCase()+item.sentiment.slice(1):"—"}
                    </span>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" as const}}>
                    {item.outlet&&<span style={{color:CYAN,fontSize:11,fontWeight:600}}>{item.outlet}</span>}
                    {item.date&&<span style={{color:MUTED,fontSize:10}}>{item.date}</span>}
                    {item.reach&&<span style={{background:ACCENT+"22",color:ACCENT,borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:600}}>Reach: {Number(item.reach).toLocaleString()}</span>}
                    {item.url&&<a href={item.url} target="_blank" rel="noopener noreferrer" style={{color:MUTED,fontSize:10,textDecoration:"underline"}}>View →</a>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
           <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Tier 1 Coverage — Meltwater Upload</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>
              {uploadedAt?`Last uploaded: ${uploadedAt} · ${tier1Rows.length} articles with Reach >1M`:"Upload Meltwater CSV — Plaud mentions with Reach >1M will be shown"}
            </div>
          </div>
          {tier1Rows.length>0&&(
            <div style={{display:"flex",gap:8}}>
              <div style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:8,padding:"4px 12px",color:"#10b981",fontSize:11,fontWeight:700}}>{pos} Positive</div>
              <div style={{background:"#f43f5e22",border:"1px solid #f43f5e44",borderRadius:8,padding:"4px 12px",color:"#f43f5e",fontSize:11,fontWeight:700}}>{neg} Negative</div>
              <div style={{background:BORDER,border:`1px solid ${BORDER}`,borderRadius:8,padding:"4px 12px",color:MUTED,fontSize:11,fontWeight:700}}>{neu} Neutral</div>
            </div>
          )}
        </div>
        <div style={{marginBottom:12,padding:"8px 12px",background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,fontSize:11,color:MUTED,lineHeight:1.8}}>
          <div style={{color:TEXT,fontWeight:600,marginBottom:4}}>How to export from Meltwater:</div>
          <div>1. Search <strong style={{color:ACCENT}}>"Plaud"</strong> → Set date range → Click <strong style={{color:CYAN}}>Export → CSV</strong></div>
          <div>2. Upload below — articles with <strong style={{color:ACCENT}}>Reach &gt; 1,000,000</strong> will be shown as Tier 1</div>
          <div>3. This data also updates the <strong style={{color:CYAN}}>Pulse</strong> tab metrics automatically</div>
        </div>
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);Array.from(e.dataTransfer.files).forEach(handleFile);}}
          onClick={()=>document.getElementById("mw-tier1-input")?.click()}
          style={{border:`2px dashed ${dragging?ACCENT:BORDER}`,borderRadius:10,padding:"20px",textAlign:"center",background:dragging?ACCENT+"11":"#13151f",transition:"all 0.15s",cursor:"pointer"}}>
          <div style={{fontSize:24,marginBottom:6}}>📊</div>
          <div style={{color:TEXT,fontSize:12,fontWeight:600,marginBottom:2}}>Drop Meltwater CSV here or click to upload</div>
          <div style={{color:MUTED,fontSize:11}}>Supports standard Meltwater export format</div>
          <input id="mw-tier1-input" type="file" accept=".csv" style={{display:"none"}} onChange={e=>Array.from(e.target.files||[]).forEach(handleFile)}/>
        </div>
      </Card>
    </div>
  );
}

// ─── Brand Awareness ─────────────────────────────────────────
function BrandAwarenessModule({ keywordData,pageData,uploadedAt,onLoad,trendsData,trendsKeywords,trendsUploadedAt,onTrendsLoad }: {
  keywordData:any[]; pageData:any[]; uploadedAt:string|null;
  onLoad:(keywords:any[],pages:any[],date:string)=>void;
  trendsData:any[]; trendsKeywords:string[]; trendsUploadedAt:string|null;
  onTrendsLoad:(data:any[],keywords:string[],date:string)=>void;
}) {
  const [dragging,setDragging]             = useState(false);
  const [draggingTrends,setDraggingTrends] = useState(false);

  const normalizeRow = (row:any):any => {
    const out:any={};
    for (const [k,v] of Object.entries(row)) {
      const kl=k.toLowerCase();
      if (kl.includes("query")||kl.includes("search term"))     out["Query"]      =v;
      else if (kl.includes("click")&&!kl.includes("rate"))      out["Clicks"]     =v;
      else if (kl.includes("impression"))                       out["Impressions"]=v;
      else if (kl.includes("rate")||kl.includes("ctr"))         out["CTR"]        =v;
      else if (kl.includes("position")||kl.includes("average")) out["Position"]   =v;
      else if (kl.includes("page")||kl.includes("screen class"))out["Page"]       =v;
      else if (kl.includes("view"))                             out["Views"]      =v;
      else if (kl.includes("user"))                             out["Users"]      =v;
      else out[k]=v;
    }
    return out;
  };

  const handleFile = (file:File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text=e.target?.result as string;
      const rawRows=parseGA4CSV(text);
      if (!rawRows.length) return;
      const rows=rawRows.map(normalizeRow);
      const keys=Object.keys(rawRows[0]).map(k=>k.toLowerCase());
      const date=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
      if (keys.some(k=>k.includes("query")||k.includes("search term")||k.includes("click"))) onLoad(rows,pageData,date);
      else onLoad(keywordData,rows,date);
    };
    reader.readAsText(file);
  };

  const handleTrendsFile = (file:File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text=e.target?.result as string;
      const {chartData,keywords}=parseGoogleTrendsCSV(text);
      if (!chartData.length) return;
      const date=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
      onTrendsLoad(chartData,keywords,date);
    };
    reader.readAsText(file);
  };

  const hasData   = keywordData.length>0||pageData.length>0;
  const hasTrends = trendsData.length>0;
  const brandKws  = keywordData.filter(r=>{const q=(r.Query||"").toLowerCase();return q.includes("plaud")||q.includes("notepin");});
  const nonBrandKws = keywordData.filter(r=>{const q=(r.Query||"").toLowerCase();return !q.includes("plaud")&&!q.includes("notepin");});
  const totalBrandClicks      = brandKws.reduce((s,r)=>s+(parseInt(r.Clicks||"0")||0),0);
  const totalBrandImpressions = brandKws.reduce((s,r)=>s+(parseInt(r.Impressions||"0")||0),0);
  const keywordChart = keywordData.slice(0,10).map(r=>({name:(r.Query||"").length>22?(r.Query||"").slice(0,20)+"…":(r.Query||""),clicks:parseInt(r.Clicks||"0")||0,isBrand:(r.Query||"").toLowerCase().includes("plaud")||(r.Query||"").toLowerCase().includes("notepin")}));
  const pageChart    = pageData.slice(0,8).map(r=>({name:((r["Page path and screen class"]||r.Page||r.page||"/").replace("https://www.plaud.ai","").slice(0,25))||"/",views:parseInt(r.Views||r.views||"0")||0,users:parseInt(r.Users||r.users||"0")||0}));
  const trendsTickInterval = Math.max(1,Math.floor(trendsData.length/12));

  return (
    <div style={{display:"grid",gap:16}}>


      {/* Trends Chart */}
      {hasTrends&&(
        <Card>
          <CardTitle sub={`Search interest (0–100) · ${trendsData[0]?.date} → ${trendsData[trendsData.length-1]?.date}`}>
            Google Trends: Search Interest Comparison
          </CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
              <XAxis dataKey="date" stroke={MUTED} fontSize={10} interval={trendsTickInterval} angle={-20} textAnchor="end" height={40}/>
              <YAxis stroke={MUTED} fontSize={10} domain={[0,100]}/>
              <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,fontSize:11}} formatter={(val:any,name:any)=>[`${val}`,name]}/>
              <Legend wrapperStyle={{fontSize:11,paddingTop:8}}/>
              {trendsKeywords.map((kw,i)=>(
                <Line key={kw} type="monotone" dataKey={kw} stroke={TREND_COLORS[i%TREND_COLORS.length]}
                  strokeWidth={kw.toLowerCase().includes("plaud")?2.5:1.5} dot={false} name={kw}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(trendsKeywords.length,3)},1fr)`,gap:10,marginTop:14}}>
            {trendsKeywords.map((kw,i)=>{
              const vals=trendsData.map(d=>d[kw] as number).filter(v=>v!==undefined);
              const peak=Math.max(...vals);
              const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
              const latest=vals[vals.length-1]??0;
              return (
                <div key={kw} style={{background:"#13151f",border:`1px solid ${TREND_COLORS[i%TREND_COLORS.length]}33`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{color:TREND_COLORS[i%TREND_COLORS.length],fontSize:11,fontWeight:700,marginBottom:6}}>{kw}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                    <div><div style={{color:MUTED,fontSize:9,textTransform:"uppercase"}}>Peak</div><div style={{color:TEXT,fontSize:14,fontWeight:700}}>{peak}</div></div>
                    <div><div style={{color:MUTED,fontSize:9,textTransform:"uppercase"}}>Avg</div><div style={{color:TEXT,fontSize:14,fontWeight:700}}>{avg}</div></div>
                    <div><div style={{color:MUTED,fontSize:9,textTransform:"uppercase"}}>Latest</div><div style={{color:TEXT,fontSize:14,fontWeight:700}}>{latest}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* GA4 Data */}
      {!hasData&&<Card><div style={{textAlign:"center",padding:"32px 0",color:MUTED}}><div style={{fontSize:36,marginBottom:12}}>📊</div><div style={{fontSize:13,fontWeight:600,marginBottom:6,color:TEXT}}>No GA4 data uploaded yet</div><div style={{fontSize:12}}>Follow the export guide above.</div></div></Card>}
      {hasData&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            <MetricTile label="Brand Queries"     value={String(brandKws.length)}                sub="plaud / notepin terms"/>
            <MetricTile label="Brand Clicks"      value={totalBrandClicks.toLocaleString()}      trend="up" sub="last 28 days"/>
            <MetricTile label="Brand Impressions" value={totalBrandImpressions.toLocaleString()} trend="up" sub="last 28 days"/>
            <MetricTile label="Non-Brand Queries" value={String(nonBrandKws.length)}             sub="category keywords"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {keywordChart.length>0&&(
              <Card>
                <CardTitle sub="Brand keywords (purple) vs non-brand — last 28 days">Search Query Performance</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={keywordChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="name" stroke={MUTED} fontSize={9} angle={-20} textAnchor="end" height={50}/>
                    <YAxis stroke={MUTED} fontSize={10}/>
                    <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}}/>
                    <Bar dataKey="clicks" name="Clicks" radius={[3,3,0,0]}>
                      {keywordChart.map((entry,i)=><Cell key={i} fill={entry.isBrand?ACCENT:MUTED}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
            {pageChart.length>0&&(
              <Card>
                <CardTitle sub="Top pages by views — last 28 days">Top Pages</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={pageChart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis type="number" stroke={MUTED} fontSize={10}/>
                    <YAxis type="category" dataKey="name" stroke={MUTED} fontSize={9} width={110}/>
                    <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}}/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    <Bar dataKey="views" fill={CYAN}   name="Views" radius={[0,4,4,0]}/>
                    <Bar dataKey="users" fill={ACCENT} name="Users" radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
          {keywordData.length>0&&(
            <Card>
              <CardTitle sub="Full search query breakdown — last 28 days">Search Query Details</CardTitle>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
                    {["Query","Clicks","Impressions","CTR","Avg. Position","Type"].map(h=>(
                      <th key={h} style={{color:MUTED,padding:"6px 10px",textAlign:h==="Query"?"left":"center",fontWeight:600}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {keywordData.slice(0,15).map((r,i)=>{
                      const isBrand=(r.Query||"").toLowerCase().includes("plaud")||(r.Query||"").toLowerCase().includes("notepin");
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${BORDER}22`,background:isBrand?ACCENT+"08":"transparent"}}>
                          <td style={{color:TEXT,padding:"8px 10px",fontWeight:600}}>{r.Query}</td>
                          <td style={{color:ACCENT,padding:"8px 10px",textAlign:"center",fontWeight:700}}>{r.Clicks}</td>
                          <td style={{color:MUTED,padding:"8px 10px",textAlign:"center"}}>{r.Impressions}</td>
                          <td style={{color:CYAN,padding:"8px 10px",textAlign:"center"}}>{r.CTR}</td>
                          <td style={{color:TEXT,padding:"8px 10px",textAlign:"center"}}>{r.Position}</td>
                          <td style={{padding:"8px 10px",textAlign:"center"}}>
                            <span style={{background:isBrand?ACCENT+"33":"#2a2d3a",color:isBrand?ACCENT:MUTED,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:600}}>{isBrand?"Brand":"Non-Brand"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
            {/* GA4 Upload */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Brand Awareness — GA4 Last 28 Days</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>{uploadedAt?`Last uploaded: ${uploadedAt} · Data period: last 28 days`:"Upload GA4 CSV exports — use Last 28 Days date range"}</div>
          </div>
          {hasData&&(
            <div style={{display:"flex",gap:8}}>
              <div style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:8,padding:"6px 14px",color:"#10b981",fontSize:11,fontWeight:700}}>Brand Clicks: {totalBrandClicks.toLocaleString()}</div>
              <div style={{background:ACCENT+"22",border:`1px solid ${ACCENT}44`,borderRadius:8,padding:"6px 14px",color:ACCENT,fontSize:11,fontWeight:700}}>Brand Impressions: {totalBrandImpressions.toLocaleString()}</div>
            </div>
          )}
        </div>
        <div style={{marginBottom:14,padding:"10px 14px",background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,fontSize:11,color:MUTED,lineHeight:1.8}}>
          <div style={{color:TEXT,fontWeight:600,marginBottom:6}}>How to export from GA4:</div>
          <div>1. <span style={{color:CYAN}}>Keywords CSV:</span> GA4 → Reports → Acquisition → Search Console → Queries → Last 28 days → Download CSV</div>
          <div>2. <span style={{color:ACCENT}}>Pages CSV:</span> GA4 → Reports → Engagement → Pages and screens → Last 28 days → Download CSV</div>
        </div>
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);Array.from(e.dataTransfer.files).forEach(handleFile);}}
          onClick={()=>document.getElementById("ga4-input")?.click()}
          style={{border:`2px dashed ${dragging?ACCENT:BORDER}`,borderRadius:10,padding:"24px 20px",textAlign:"center",background:dragging?ACCENT+"11":"#13151f",transition:"all 0.15s",cursor:"pointer"}}>
          <div style={{fontSize:28,marginBottom:8}}>📂</div>
          <div style={{color:TEXT,fontSize:13,fontWeight:600,marginBottom:4}}>Drop CSV files here or click to upload</div>
          <div style={{color:MUTED,fontSize:11}}>Supports <strong style={{color:CYAN}}>ga4-keywords.csv</strong> and <strong style={{color:ACCENT}}>ga4-pages.csv</strong></div>
          <input id="ga4-input" type="file" accept=".csv" multiple style={{display:"none"}} onChange={e=>Array.from(e.target.files||[]).forEach(handleFile)}/>
        </div>
        <div style={{display:"flex",gap:10,marginTop:10}}>
          <div style={{flex:1,background:"#13151f",border:`1px solid ${keywordData.length?CYAN+"55":BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:11}}>
            <span style={{color:keywordData.length?"#10b981":MUTED}}>{keywordData.length?"✓":"○"}</span>
            <span style={{color:MUTED,marginLeft:6}}>Keywords CSV</span>
            {keywordData.length>0&&<span style={{color:CYAN,marginLeft:6}}>{keywordData.length} queries loaded</span>}
          </div>
          <div style={{flex:1,background:"#13151f",border:`1px solid ${pageData.length?ACCENT+"55":BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:11}}>
            <span style={{color:pageData.length?"#10b981":MUTED}}>{pageData.length?"✓":"○"}</span>
            <span style={{color:MUTED,marginLeft:6}}>Pages CSV</span>
            {pageData.length>0&&<span style={{color:ACCENT,marginLeft:6}}>{pageData.length} pages loaded</span>}
          </div>
        </div>
      </Card>

      {/* Google Trends Upload */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{color:TEXT,fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>Google Trends — Search Interest Over Time</div>
            <div style={{color:MUTED,fontSize:11,marginTop:2}}>{trendsUploadedAt?`Last uploaded: ${trendsUploadedAt} · ${trendsKeywords.length} keywords · ${trendsData.length} data points`:"Upload Google Trends CSV export"}</div>
          </div>
          {hasTrends&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap" as const}}>
              {trendsKeywords.map((kw,i)=>(
                <span key={kw} style={{background:TREND_COLORS[i%TREND_COLORS.length]+"22",border:`1px solid ${TREND_COLORS[i%TREND_COLORS.length]}44`,borderRadius:6,padding:"3px 10px",color:TREND_COLORS[i%TREND_COLORS.length],fontSize:11,fontWeight:700}}>{kw}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{marginBottom:14,padding:"10px 14px",background:"#13151f",border:`1px solid ${BORDER}`,borderRadius:8,fontSize:11,color:MUTED,lineHeight:1.8}}>
          <div style={{color:TEXT,fontWeight:600,marginBottom:6}}>How to export from Google Trends:</div>
          <div>1. Go to <span style={{color:CYAN}}>trends.google.com</span> → Search "Plaud" + add competitors</div>
          <div>2. Set date range → Click <span style={{color:ACCENT}}>↓ download</span> button</div>
          <div>3. Upload the downloaded <strong style={{color:CYAN}}>multiTimeline.csv</strong> below</div>
        </div>
        <div onDragOver={e=>{e.preventDefault();setDraggingTrends(true);}} onDragLeave={()=>setDraggingTrends(false)}
          onDrop={e=>{e.preventDefault();setDraggingTrends(false);Array.from(e.dataTransfer.files).forEach(handleTrendsFile);}}
          onClick={()=>document.getElementById("trends-input")?.click()}
          style={{border:`2px dashed ${draggingTrends?"#10b981":BORDER}`,borderRadius:10,padding:"24px 20px",textAlign:"center",background:draggingTrends?"#10b98111":"#13151f",transition:"all 0.15s",cursor:"pointer"}}>
          <div style={{fontSize:28,marginBottom:8}}>📈</div>
          <div style={{color:TEXT,fontSize:13,fontWeight:600,marginBottom:4}}>Drop Google Trends CSV here or click to upload</div>
          <div style={{color:MUTED,fontSize:11}}>Supports <strong style={{color:CYAN}}>multiTimeline.csv</strong></div>
          <input id="trends-input" type="file" accept=".csv" style={{display:"none"}} onChange={e=>{if(e.target.files?.[0])handleTrendsFile(e.target.files[0]);}}/>
        </div>
      </Card>
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────
export default function Dashboard({ initialInsights,initialCoverage,initialMetrics,generatedAt,weekNumber }: DashboardProps) {
  const [tab,setTab] = useState(0);
  const tabs = ["📊 Pulse","🧭 Narrative","⚔️ Competitive","🎯 Action","🧠 AI Insights","📰 Tier 1 Coverage","📈 Brand Awareness"];

  // Region data for Pulse
  const [regionData, setRegionData] = useState<Record<string,{rows:any[];date:string|null}>>({
    us:   {rows:[],date:null},
    eu:   {rows:[],date:null},
    jp:   {rows:[],date:null},
    apac: {rows:[],date:null},
  });

  // Shared Meltwater state (for Tier 1 tab)
  const [mwData,setMwData] = useState<any[]>([]);
  const [mwDate,setMwDate] = useState<string|null>(null);

  // GA4 state
  const [keywordData,setKeywordData] = useState<any[]>([]);
  const [pageData,setPageData]       = useState<any[]>([]);
  const [ga4Date,setGa4Date]         = useState<string|null>(null);

  // Trends state
  const [trendsData,setTrendsData]             = useState<any[]>([]);
  const [trendsKeywords,setTrendsKeywords]     = useState<string[]>([]);
  const [trendsUploadedAt,setTrendsUploadedAt] = useState<string|null>(null);
const [regionPrevData, setRegionPrevData] = useState<Record<string,{rows:any[];date:string|null}>>({
  us:{rows:[],date:null}, eu:{rows:[],date:null}, jp:{rows:[],date:null}, apac:{rows:[],date:null},
});
  // Load from Redis on mount
  const [loaded,setLoaded] = useState(false);
  useState(()=>{
    const load = async () => {
      try {
        const [mw,ga4,trends,us,eu,jp,apac,mwPrev,usPrev,euPrev,jpPrev,apacPrev] = await Promise.all([
  fetch("/api/load-data?key=meltwater").then(r=>r.json()),
  fetch("/api/load-data?key=ga4").then(r=>r.json()),
  fetch("/api/load-data?key=trends").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_us").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_eu").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_jp").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_apac").then(r=>r.json()),
  fetch("/api/load-data?key=meltwater_prev").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_us_prev").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_eu_prev").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_jp_prev").then(r=>r.json()),
  fetch("/api/load-data?key=pulse_apac_prev").then(r=>r.json()),
]);
        if (mw.data)     { setMwData(mw.data.rows);          setMwDate(mw.data.date); }
        if (ga4.data)    { setKeywordData(ga4.data.keywords); setPageData(ga4.data.pages); setGa4Date(ga4.data.date); }
        if (trends.data) { setTrendsData(trends.data.rows);   setTrendsKeywords(trends.data.keywords); setTrendsUploadedAt(trends.data.date); }
        const newRegion: Record<string,{rows:any[];date:string|null}> = {us:{rows:[],date:null},eu:{rows:[],date:null},jp:{rows:[],date:null},apac:{rows:[],date:null}};
        if (us.data)   newRegion.us   = {rows:us.data.rows,   date:us.data.date};
        if (eu.data)   newRegion.eu   = {rows:eu.data.rows,   date:eu.data.date};
        if (jp.data)   newRegion.jp   = {rows:jp.data.rows,   date:jp.data.date};
        if (apac.data) newRegion.apac = {rows:apac.data.rows, date:apac.data.date};
        setRegionData(newRegion);
        const newPrevRegion: Record<string,{rows:any[];date:string|null}> = {us:{rows:[],date:null},eu:{rows:[],date:null},jp:{rows:[],date:null},apac:{rows:[],date:null}};
if (usPrev.data)   newPrevRegion.us   = {rows:usPrev.data.rows,   date:usPrev.data.date};
if (euPrev.data)   newPrevRegion.eu   = {rows:euPrev.data.rows,   date:euPrev.data.date};
if (jpPrev.data)   newPrevRegion.jp   = {rows:jpPrev.data.rows,   date:jpPrev.data.date};
if (apacPrev.data) newPrevRegion.apac = {rows:apacPrev.data.rows, date:apacPrev.data.date};
setRegionPrevData(newPrevRegion);
      } catch {}
      setLoaded(true);
    };
    load();
  });

  const handleMwLoad = async (rows:any[],date:string) => {
    setMwData(rows); setMwDate(date);
    await fetch("/api/save-data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"meltwater",data:{rows,date}})});
  };

  const handleGA4Load = async (keywords:any[],pages:any[],date:string) => {
    setKeywordData(keywords); setPageData(pages); setGa4Date(date);
    await fetch("/api/save-data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"ga4",data:{keywords,pages,date}})});
  };

  const handleTrendsLoad = async (data:any[],keywords:string[],date:string) => {
    setTrendsData(data); setTrendsKeywords(keywords); setTrendsUploadedAt(date);
    await fetch("/api/save-data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"trends",data:{rows:data,keywords,date}})});
  };

  const handleRegionLoad = async (region:string,rows:any[],date:string) => {
    setRegionData(prev=>({...prev,[region]:{rows,date}}));
    await fetch("/api/save-data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:`pulse_${region}`,data:{rows,date}})});
  };

  return (
    <div style={{background:DARK,minHeight:"100vh",fontFamily:"'Inter',-apple-system,sans-serif",color:TEXT}}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#22d3ee)",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16}}>P</div>
          <div>
            <div style={{color:TEXT,fontWeight:800,fontSize:15}}>Plaud Brand & PR Intelligence System</div>
            <div style={{color:MUTED,fontSize:11}}>
              {generatedAt?`Updated ${new Date(generatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} · Week ${weekNumber}`:"PR Control Tower · Auto-updates every Thursday"}
            </div>
          </div>
        </div>
        <div style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:6,padding:"4px 10px",color:"#10b981",fontSize:11,fontWeight:600}}>● Live</div>
      </div>
      <div style={{padding:"0 24px",borderBottom:`1px solid ${BORDER}`,display:"flex",gap:2,overflowX:"auto"}}>
        {tabs.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{background:"none",border:"none",borderBottom:tab===i?"2px solid #6366f1":"2px solid transparent",color:tab===i?TEXT:MUTED,padding:"12px 16px",fontSize:12,fontWeight:tab===i?700:400,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>
        ))}
      </div>
      <div style={{padding:24,maxWidth:1200,margin:"0 auto"}}>
        {!loaded&&<div style={{color:MUTED,fontSize:12,textAlign:"center",padding:"40px 0"}}>Loading data...</div>}
        {loaded&&<>
          {tab===0&&<PulseModule regionData={regionData} onRegionLoad={handleRegionLoad} regionPrevData={regionPrevData}/>}
          {tab===1&&<NarrativeModule/>}
          {tab===2&&<CompetitiveModule/>}
          {tab===3&&<ActionModule coverage={initialCoverage||[]}/>}
          {tab===4&&<AIInsightsModule initialInsights={initialInsights} generatedAt={generatedAt} weekNumber={weekNumber}/>}
          {tab===5&&<Tier1Module onMeltwaterLoad={handleMwLoad} mwRows={mwData} uploadedAt={mwDate}/>}
          {tab===6&&(
            <BrandAwarenessModule
              keywordData={keywordData} pageData={pageData} uploadedAt={ga4Date} onLoad={handleGA4Load}
              trendsData={trendsData} trendsKeywords={trendsKeywords} trendsUploadedAt={trendsUploadedAt} onTrendsLoad={handleTrendsLoad}
            />
          )}
        </>}
      </div>
    </div>
  );
}