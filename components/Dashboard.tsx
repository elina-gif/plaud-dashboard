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
const coColors: Record<string, string> = {
  Plaud: "#6366f1", "Otter.ai": "#22d3ee", "Notion AI": "#f59e0b", reMarkable: "#10b981",
};
const sentColors: Record<string, string> = {
  Positive: "#10b981", Neutral: "#6366f1", Negative: "#f43f5e",
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

const weeklyData = [
  { week: "W1", plaud: 12, otter: 18, notion: 22, remarkable: 8  },
  { week: "W2", plaud: 19, otter: 20, notion: 19, remarkable: 10 },
  { week: "W3", plaud: 24, otter: 17, notion: 25, remarkable: 9  },
  { week: "W4", plaud: 31, otter: 22, notion: 21, remarkable: 12 },
  { week: "W5", plaud: 28, otter: 24, notion: 18, remarkable: 11 },
  { week: "W6", plaud: 38, otter: 21, notion: 20, remarkable: 13 },
];
const sentimentData = [
  { name: "Positive", value: 54, color: "#10b981" },
  { name: "Neutral",  value: 31, color: "#6366f1" },
  { name: "Negative", value: 15, color: "#f43f5e" },
];
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
const journalists = [
  { name: "Casey Newton",  outlet: "The Verge",      status: "Warm",    lastContact: "5d ago",  angle: "AI Work Companion"  },
  { name: "Nitasha Tiku",  outlet: "Washington Post", status: "Cold",    lastContact: "32d ago", angle: "Conv. Intelligence" },
  { name: "Zoe Schiffer",  outlet: "Wired",           status: "Engaged", lastContact: "2d ago",  angle: "AI Hardware"        },
  { name: "Will Knight",   outlet: "Wired",           status: "Cold",    lastContact: "45d ago", angle: "AI Productivity"    },
  { name: "Lauren Goode",  outlet: "Wired",           status: "Warm",    lastContact: "12d ago", angle: "AI Note Taker"      },
  { name: "Steven Levy",   outlet: "Wired",           status: "Cold",    lastContact: "60d ago", angle: "Future of Work"     },
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
  { metric: "Exec Quote Pickups",      value: "9",      trend: "up"   },
];
const monthlyBar = [
  { month: "Nov '25", plaud: 3, otter: 4, notion: 3, remarkable: 2 },
  { month: "Dec '25", plaud: 5, otter: 6, notion: 4, remarkable: 2 },
  { month: "Jan '26", plaud: 9, otter: 4, notion: 5, remarkable: 4 },
  { month: "Feb '26", plaud: 4, otter: 5, notion: 6, remarkable: 3 },
  { month: "Mar '26*",plaud: 2, otter: 2, notion: 3, remarkable: 1 },
];
const outletRows = [
  { outlet: "Forbes",      traffic: "70M+" },
  { outlet: "Bloomberg",   traffic: "50M+" },
  { outlet: "CNBC",        traffic: "40M+" },
  { outlet: "CNET",        traffic: "30M+" },
  { outlet: "Wired",       traffic: "20M+" },
  { outlet: "The Verge",   traffic: "15M+" },
  { outlet: "TechCrunch",  traffic: "10M+" },
  { outlet: "Tom's Guide", traffic: "8M+"  },
  { outlet: "ZDNET",       traffic: "8M+"  },
  { outlet: "Engadget",    traffic: "5M+"  },
];
const defaultCoverage = [
  { co: "Plaud",      outlet: "TechCrunch", traffic: "10M+", date: "Dec 29, 2025", title: "Plaud Note Pro is an excellent AI-powered recorder that I carry everywhere", type: "Review",    sentiment: "Positive", journalist: "Ivan Mehta"      },
  { co: "Plaud",      outlet: "TechCrunch", traffic: "10M+", date: "Jan 4, 2026",  title: "Plaud launches a new AI pin and a desktop meeting notetaker",                type: "News",      sentiment: "Positive", journalist: "Ivan Mehta"      },
  { co: "Plaud",      outlet: "The Verge",  traffic: "15M+", date: "Jan 4, 2026",  title: "Plaud NotePin S debuts at CES 2026 with new highlight button",               type: "News",      sentiment: "Positive", journalist: "Dominic Preston" },
  { co: "Plaud",      outlet: "Forbes",     traffic: "70M+", date: "Jan 4, 2026",  title: "New Plaud NotePin S Desktop Software Takes Notes At Meetings",               type: "News",      sentiment: "Positive", journalist: "Mark Sparrow"    },
  { co: "Plaud",      outlet: "CNET",       traffic: "30M+", date: "Jan 4, 2026",  title: "My CES 2026 Secret Weapon? This New Wearable AI Note-Taking Pin From Plaud", type: "Review",    sentiment: "Positive", journalist: "Katie Collins"   },
  { co: "Plaud",      outlet: "ZDNET",      traffic: "8M+",  date: "Jan 4, 2026",  title: "Plaud has unveiled a new AI wearable — I'm considering replacing Otter.ai",  type: "Review",    sentiment: "Positive", journalist: "Sabrina Ortiz"   },
  { co: "Otter.ai",   outlet: "Bloomberg",  traffic: "50M+", date: "Dec 2025",     title: "Otter.ai AI Avatar Technology Transforms Executive Productivity",             type: "Feature",   sentiment: "Positive", journalist: "Staff"           },
  { co: "Otter.ai",   outlet: "CNBC",       traffic: "40M+", date: "Dec 2025",     title: "Otter.ai CEO on $100M ARR and new AI Meeting Agents",                        type: "Interview", sentiment: "Positive", journalist: "Jim Cramer"      },
  { co: "Notion AI",  outlet: "The Verge",  traffic: "15M+", date: "Feb 2026",     title: "Notion Custom Agents Could Be the Future of Knowledge Work",                 type: "Review",    sentiment: "Positive", journalist: "Staff"           },
  { co: "reMarkable", outlet: "The Verge",  traffic: "15M+", date: "Jan 2026",     title: "reMarkable Paper Pro review: the best digital paper tablet",                 type: "Review",    sentiment: "Positive", journalist: "Staff"           },
];

// ─── 小组件 ──────────────────────────────────────────────────
const StatusBadge = ({ s }: { s: string }) => (
  <span style={{ background: (statusColors[s]||"#94a3b8")+"22", color: statusColors[s]||"#94a3b8", border: `1px solid ${(statusColors[s]||"#94a3b8")}44`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{s}</span>
);
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, ...style }}>{children}</div>
);
const CardTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</div>
    {sub && <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{sub}</div>}
  </div>
);
const MetricTile = ({ label, value, trend, sub }: { label: string; value: string; trend?: string; sub?: string }) => (
  <div style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
    <div style={{ color: MUTED, fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    <div style={{ color: TEXT, fontSize: 22, fontWeight: 800 }}>{value}</div>
    {trend && <div style={{ color: trend==="up"?"#10b981":"#f43f5e", fontSize: 11, marginTop: 2 }}>{trend==="up"?"▲":"▼"} {sub}</div>}
  </div>
);

// ─── CSV 解析（兼容 GA4 格式）────────────────────────────────
function parseGA4CSV(text: string): any[] {
  // 跳过 # 开头注释行和空行
  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#"));
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const rows: any[] = [];
  let i = 1;
  while (i < lines.length) {
    let line = lines[i];
    // GA4 有时数据行会被折行，列数不够就拼下一行
    while (line.split(",").length < headers.length && i + 1 < lines.length) {
      i++;
      line = line + " " + lines[i].trim();
    }
    const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
    const obj: any = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] || ""; });
    rows.push(obj);
    i++;
  }
  return rows;
}

// ─── Narrative Ownership 可编辑卡片 ─────────────────────────
function NarrativeOwnershipCard() {
  const [data, setData]       = useState(defaultNarrativeData);
  const [editing, setEditing] = useState<{ idx: number; field: "current"|"target" }|null>(null);
  const [editVal, setEditVal] = useState("");
  const quarter = "Q1 2026";

  const startEdit = (idx: number, field: "current"|"target", val: number) => {
    setEditing({ idx, field });
    setEditVal(String(val));
  };
  const commitEdit = () => {
    if (!editing) return;
    const num = Math.min(100, Math.max(0, parseInt(editVal)||0));
    const updated = [...data];
    updated[editing.idx] = { ...updated[editing.idx], [editing.field]: num };
    setData(updated);
    setEditing(null);
  };

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>Plaud Narrative Ownership</div>
        <span style={{ background: ACCENT+"22", color: ACCENT, border: `1px solid ${ACCENT}44`, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{quarter}</span>
      </div>
      <div style={{ color: MUTED, fontSize: 11, marginBottom: 10 }}>Current vs target narrative penetration</div>
      <div style={{ marginBottom: 16, padding: "8px 12px", background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11, color: MUTED, lineHeight: 1.8 }}>
        <div><span style={{ color: ACCENT, fontWeight: 600 }}>Current %</span> = Media data (50%) + Team assessment (50%) — updated each quarter</div>
        <div><span style={{ color: MUTED, fontWeight: 600 }}>Target %</span> &nbsp;= Brand team's quarterly goal, updated each quarter</div>
        <div style={{ marginTop: 4, color: "#f59e0b", fontSize: 10 }}>💡 Click any number to edit directly</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((row, idx) => (
          <div key={row.narrative}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{row.narrative}</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {editing?.idx===idx && editing?.field==="current" ? (
                  <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commitEdit} onKeyDown={e=>e.key==="Enter"&&commitEdit()}
                    style={{ width: 48, background: BORDER, border: `1px solid ${ACCENT}`, borderRadius: 4, color: TEXT, fontSize: 12, fontWeight: 700, textAlign: "center", padding: "2px 4px", outline: "none" }} />
                ) : (
                  <span onClick={()=>startEdit(idx,"current",row.current)} title="Click to edit"
                    style={{ color: ACCENT, fontSize: 12, fontWeight: 700, cursor: "pointer", borderBottom: `1px dashed ${ACCENT}55` }}>{row.current}%</span>
                )}
                <span style={{ color: BORDER }}>/ target</span>
                {editing?.idx===idx && editing?.field==="target" ? (
                  <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commitEdit} onKeyDown={e=>e.key==="Enter"&&commitEdit()}
                    style={{ width: 48, background: BORDER, border: `1px solid ${MUTED}`, borderRadius: 4, color: TEXT, fontSize: 12, fontWeight: 700, textAlign: "center", padding: "2px 4px", outline: "none" }} />
                ) : (
                  <span onClick={()=>startEdit(idx,"target",row.target)} title="Click to edit"
                    style={{ color: MUTED, fontSize: 12, fontWeight: 700, cursor: "pointer", borderBottom: `1px dashed ${MUTED}55` }}>{row.target}%</span>
                )}
              </div>
            </div>
            <div style={{ position: "relative", height: 8, background: BORDER, borderRadius: 4 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: `${row.target}%`, height: "100%", background: "#2a2d3a", borderRadius: 4 }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: `${row.current}%`, height: "100%", background: row.current>=row.target?"#10b981":ACCENT, borderRadius: 4, transition: "width 0.3s" }} />
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: row.current>=row.target?"#10b981":"#f59e0b" }}>
              {row.current>=row.target ? `✓ On track (${row.current-row.target}% above target)` : `△ ${row.target-row.current}% below target`}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Pulse ───────────────────────────────────────────────────
function PulseModule({ metrics }: { metrics: any }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <MetricTile label="Weekly Mentions"       value={metrics?String(metrics.totalMentions):"284"} trend="up"   sub="vs 201 last week" />
        <MetricTile label="Tier-1 Coverage"       value={metrics?String(metrics.tier1Count):"38"}     trend="up"   sub="+41% MoM"         />
        <MetricTile label="Sentiment Score"       value="7.2/10"                                       trend="up"   sub="+0.4 pts"         />
        <MetricTile label="Share of Voice"        value={metrics?`${metrics.shareOfVoice}%`:"12%"}    trend="down" sub="vs 14% last week" />
        <MetricTile label="Exec Quotes Picked Up" value="9"                                            trend="up"   sub="across 6 outlets" />
        <MetricTile label="Narrative Match %"     value={metrics?`${metrics.positiveRatio}%`:"46%"}   trend="up"   sub="AI Work Companion" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardTitle sub="Weekly mentions vs competitors">Media Coverage Trend</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="week" stroke={MUTED} fontSize={11} />
              <YAxis stroke={MUTED} fontSize={11} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="plaud"      stroke={ACCENT}  strokeWidth={2.5} dot={false} name="Plaud"      />
              <Line type="monotone" dataKey="otter"      stroke={CYAN}    strokeWidth={1.5} dot={false} name="Otter.ai"   />
              <Line type="monotone" dataKey="notion"     stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Notion AI"  />
              <Line type="monotone" dataKey="remarkable" stroke="#10b981" strokeWidth={1.5} dot={false} name="reMarkable" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle sub="PR contribution to business">Business Impact Metrics</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {businessMetrics.map(m => (
              <div key={m.metric} style={{ background: "#13151f", borderRadius: 8, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
                <div style={{ color: MUTED, fontSize: 10, textTransform: "uppercase" }}>{m.metric}</div>
                <div style={{ color: m.trend==="up"?"#10b981":"#f43f5e", fontSize: 18, fontWeight: 700, marginTop: 2 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Narrative ───────────────────────────────────────────────
function NarrativeModule() {
  const [topics, setTopics] = useState(defaultTopics);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <NarrativeOwnershipCard />
        <Card>
          <CardTitle sub="Media sentiment this week">Sentiment Breakdown</CardTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {sentimentData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {sentimentData.map(s => (
                <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                    <span style={{ color: MUTED, fontSize: 12 }}>{s.name}</span>
                  </div>
                  <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{s.value}%</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#13151f", borderRadius: 8, border: `1px solid ${BORDER}` }}>
                <div style={{ color: MUTED, fontSize: 10 }}>NARRATIVE RISK</div>
                <div style={{ color: "#f43f5e", fontSize: 12, marginTop: 2 }}>15% negative driven by "AI Note Taker" label limiting perception</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Industry Narrative Landscape</div>
          <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>Which AI stories are breaking — and is Plaud in them?</div>
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 12px" }}>
            <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>IN</span>
            <span style={{ color: MUTED, fontSize: 11 }}>=</span>
            <span style={{ color: MUTED, fontSize: 11 }}>Plaud has actively published content on this topic (pitch / article / statement)</span>
            <span style={{ color: MUTED, fontSize: 11, margin: "0 4px" }}>·</span>
            <span style={{ color: "#f43f5e", fontSize: 11, fontWeight: 700 }}>OUT</span>
            <span style={{ color: MUTED, fontSize: 11 }}>=</span>
            <span style={{ color: MUTED, fontSize: 11 }}>Not yet covered — pitch opportunity</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {topics.map((t, idx) => (
            <div key={t.topic} style={{ background: "#13151f", border: `1px solid ${t.plaudIn?ACCENT+"55":BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: TEXT, fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{t.topic}</span>
                <button onClick={() => { const u=[...topics]; u[idx]={...u[idx],plaudIn:!u[idx].plaudIn}; setTopics(u); }}
                  style={{ color: t.plaudIn?"#10b981":"#f43f5e", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 6, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {t.plaudIn?"✓ IN":"✗ OUT"}
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ flex: 1, background: BORDER, borderRadius: 4, height: 4 }}>
                  <div style={{ width: `${t.relevance}%`, background: t.plaudIn?ACCENT:MUTED, borderRadius: 4, height: 4 }} />
                </div>
                <span style={{ color: MUTED, fontSize: 10 }}>{t.relevance}</span>
              </div>
              {t.plaudIn ? (
                <input placeholder="Add evidence, e.g. Forbes pitch on AI Work Companion" defaultValue={t.evidence}
                  onBlur={e => { const u=[...topics]; u[idx]={...u[idx],evidence:e.target.value}; setTopics(u); }}
                  style={{ width: "100%", background: BORDER, border: "none", borderRadius: 4, padding: "4px 6px", color: TEXT, fontSize: 10, outline: "none" }} />
              ) : (
                <div style={{ color: "#f59e0b", fontSize: 10 }}>⚡ Pitch opportunity</div>
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
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardTitle sub="Plaud vs Otter.ai across PR dimensions">Competitive Radar</CardTitle>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={BORDER} />
              <PolarAngleAxis dataKey="subject" stroke={MUTED} fontSize={10} />
              <Radar name="Plaud"    dataKey="plaud" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} />
              <Radar name="Otter.ai" dataKey="otter" stroke={CYAN}   fill={CYAN}   fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle sub="This week's competitive signals">Competitor Intelligence</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { co: "Otter.ai",   signal: "Launched enterprise plan — 3 Tier-1 pieces in WSJ, Bloomberg", impact: "High",        color: "#f43f5e" },
              { co: "Notion AI",  signal: "CEO op-ed in HBR on AI for knowledge workers",                  impact: "High",        color: "#f43f5e" },
              { co: "reMarkable", signal: "Product review cycle in The Verge — physical device framing",   impact: "Low",         color: "#10b981" },
              { co: "Humane AI",  signal: "Negative press cycle — AI wearables overpromise",               impact: "Opportunity", color: "#f59e0b" },
            ].map(c => (
              <div key={c.co} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: CYAN, fontSize: 12, fontWeight: 700 }}>{c.co}</span>
                  <span style={{ color: c.color, fontSize: 10, fontWeight: 600 }}>{c.impact}</span>
                </div>
                <div style={{ color: MUTED, fontSize: 11 }}>{c.signal}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Action ──────────────────────────────────────────────────
function ActionModule() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardTitle sub="Priority journalist outreach this week">Journalist Relationship Tracker</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {journalists.map(j => (
              <div key={j.name} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{j.name} <span style={{ color: MUTED, fontWeight: 400 }}>· {j.outlet}</span></div>
                  <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>Angle: {j.angle} · Last: {j.lastContact}</div>
                </div>
                <StatusBadge s={j.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle sub="Active story pitches in pipeline">Pitch Opportunity Pipeline</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pitches.map(p => (
              <div key={p.angle} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: CYAN, fontSize: 11, fontWeight: 600 }}>{p.outlet}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <StatusBadge s={p.priority} />
                    <StatusBadge s={p.status} />
                  </div>
                </div>
                <div style={{ color: TEXT, fontSize: 12 }}>{p.angle}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardTitle sub="Next 30 days">Upcoming Media Opportunities</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingEvents.map(e => (
              <div key={e.event} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ background: ACCENT+"22", border: `1px solid ${ACCENT}44`, borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 50 }}>
                  <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700 }}>{e.date}</div>
                </div>
                <div>
                  <div style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{e.event}</div>
                  <div style={{ color: "#10b981", fontSize: 11 }}>→ {e.opportunity}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle sub="CEO & founder narrative positioning">Executive Narrative Opportunities</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { quote: "Conversation is the most underutilized source of professional intelligence.", use: "Op-ed hook / keynote opener", fit: "High"   },
              { quote: "We're building the work companion that never forgets, never misses a signal.", use: "Product launch narrative",   fit: "High"   },
              { quote: "The next frontier of AI isn't chat. It's capturing what humans say in rooms.", use: "Investor/media interviews",  fit: "Medium" },
            ].map(q => (
              <div key={q.quote} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: TEXT, fontSize: 12, fontStyle: "italic", marginBottom: 6 }}>"{q.quote}"</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: MUTED, fontSize: 11 }}>{q.use}</span>
                  <StatusBadge s={q.fit} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── AI Insights ─────────────────────────────────────────────
function AIInsightsModule({ initialInsights, generatedAt, weekNumber }: { initialInsights: any; generatedAt: string|null; weekNumber: number|null }) {
  const [insights, setInsights] = useState<any>(initialInsights);
  const [loading,  setLoading]  = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/insights", { method: "POST" });
      const data = await res.json();
      if (!data.error) setInsights(data);
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Weekly Intelligence Brief</div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>
              {generatedAt ? `Last updated: ${new Date(generatedAt).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · Week ${weekNumber}` : "Auto-updates every Thursday 09:00 CST"}
            </div>
          </div>
          <button onClick={generate} disabled={loading} style={{ background: loading?BORDER:"linear-gradient(135deg,#6366f1,#22d3ee)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: loading?"not-allowed":"pointer", opacity: loading?0.7:1 }}>
            {loading?"Analyzing...":"Generate Brief"}
          </button>
        </div>
        {!insights && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: MUTED }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
            <div style={{ fontSize: 13 }}>Click "Generate Brief" or wait for Thursday's auto-update.</div>
          </div>
        )}
        {loading && <div style={{ textAlign: "center", padding: "40px 0", color: MUTED, fontSize: 13 }}>Analyzing PR data...</div>}
        {insights && !loading && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg,#6366f122,#22d3ee11)", border: "1px solid #6366f144", borderRadius: 10, padding: 14 }}>
              <div style={{ color: CYAN, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Executive Summary</div>
              <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{insights.summary}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(insights.insights||[]).map((ins: string, i: number) => (
                <div key={i} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ color: ACCENT, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>INSIGHT {i+1}</div>
                  <div style={{ color: TEXT, fontSize: 12, lineHeight: 1.5 }}>{ins}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#f43f5e11", border: "1px solid #f43f5e33", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#f43f5e", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>NARRATIVE RISK</div>
                <div style={{ color: TEXT, fontSize: 12 }}>{insights.risk}</div>
              </div>
              <div style={{ background: "#10b98111", border: "1px solid #10b98133", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#10b981", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>TOP OPPORTUNITY</div>
                <div style={{ color: TEXT, fontSize: 12 }}>{insights.opportunity}</div>
              </div>
            </div>
            <div style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
              <div style={{ color: TEXT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Weekly Action Checklist</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(insights.actions||[]).map((a: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, border: `2px solid ${ACCENT}`, borderRadius: 4, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: TEXT, fontSize: 12, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Tier 1 Coverage ─────────────────────────────────────────
function Tier1Module({ coverage }: { coverage: any[] }) {
  const [filter, setFilter] = useState("All");
  const companies = ["All","Plaud","Otter.ai","Notion AI","reMarkable"];
  const data     = coverage.length ? coverage : defaultCoverage;
  const filtered = filter==="All" ? data : data.filter((d:any)=>(d.co||d.company)===filter);

  const stats = ["Plaud","Otter.ai","Notion AI","reMarkable"].map(co => {
    const items = data.filter((d:any)=>(d.co||d.company)===co);
    const pos   = items.filter((d:any)=>d.sentiment==="Positive").length;
    return { co, total: items.length, positive: pos, outlets: [...new Set(items.map((d:any)=>d.outlet))].length };
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {stats.map(s => (
          <div key={s.co} style={{ background: CARD, border: `1px solid ${coColors[s.co]}44`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ color: coColors[s.co], fontWeight: 800, fontSize: 13, marginBottom: 8 }}>{s.co}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: MUTED, fontSize: 11 }}>Total mentions</span>
              <span style={{ color: TEXT, fontWeight: 700 }}>{s.total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: MUTED, fontSize: 11 }}>Positive</span>
              <span style={{ color: "#10b981", fontWeight: 700 }}>{s.positive}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MUTED, fontSize: 11 }}>Outlets</span>
              <span style={{ color: TEXT, fontWeight: 700 }}>{s.outlets}</span>
            </div>
            <div style={{ marginTop: 8, background: BORDER, borderRadius: 4, height: 4 }}>
              <div style={{ width: `${s.total?Math.round((s.positive/s.total)*100):0}%`, background: coColors[s.co], borderRadius: 4, height: 4 }} />
            </div>
          </div>
        ))}
      </div>
      <Card>
        <CardTitle sub="Monthly Tier-1 mentions (traffic >1M/mo)">Coverage Trend</CardTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyBar}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="month" stroke={MUTED} fontSize={11} />
            <YAxis stroke={MUTED} fontSize={11} />
            <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="plaud"      fill={ACCENT}  name="Plaud"      radius={[3,3,0,0]} />
            <Bar dataKey="otter"      fill={CYAN}    name="Otter.ai"   radius={[3,3,0,0]} />
            <Bar dataKey="notion"     fill="#f59e0b" name="Notion AI"  radius={[3,3,0,0]} />
            <Bar dataKey="remarkable" fill="#10b981" name="reMarkable" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <CardTitle sub="Verified Tier-1 articles — auto-updated weekly">Coverage Log</CardTitle>
          <div style={{ display: "flex", gap: 6 }}>
            {companies.map(c => (
              <button key={c} onClick={()=>setFilter(c)} style={{ background: filter===c?(coColors[c]||ACCENT):BORDER, color: filter===c?"#fff":MUTED, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
          {filtered.map((item:any, i:number) => {
            const co = item.co||item.company;
            return (
              <div key={i} style={{ background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", display: "grid", gridTemplateColumns: "90px 1fr 80px", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ color: coColors[co]||ACCENT, fontSize: 11, fontWeight: 800 }}>{co}</div>
                  <div style={{ color: MUTED, fontSize: 10 }}>{item.date}</div>
                </div>
                <div>
                  <div style={{ color: TEXT, fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
                    <span style={{ color: CYAN, fontSize: 11, fontWeight: 600 }}>{item.outlet}</span>
                    <span style={{ color: MUTED, fontSize: 10 }}>{item.traffic}</span>
                    {item.journalist && item.journalist!=="Staff" && <span style={{ color: MUTED, fontSize: 10 }}>· {item.journalist}</span>}
                    <span style={{ background: "#6366f122", color: ACCENT, fontSize: 10, padding: "1px 6px", borderRadius: 4 }}>{item.type}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: sentColors[item.sentiment]||MUTED, fontSize: 11, fontWeight: 600 }}>{item.sentiment}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <CardTitle sub="Which outlets covered each brand">Outlet Coverage Matrix</CardTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <th style={{ color: MUTED, textAlign: "left",   padding: "6px 10px", fontWeight: 600 }}>Outlet</th>
                <th style={{ color: MUTED, textAlign: "center", padding: "6px 10px", fontWeight: 600 }}>Traffic</th>
                {["Plaud","Otter.ai","Notion AI","reMarkable"].map(co => (
                  <th key={co} style={{ color: coColors[co], textAlign: "center", padding: "6px 10px", fontWeight: 700 }}>{co}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outletRows.map(row => (
                <tr key={row.outlet} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                  <td style={{ color: TEXT,  padding: "8px 10px", fontWeight: 600 }}>{row.outlet}</td>
                  <td style={{ color: MUTED, padding: "8px 10px", textAlign: "center", fontSize: 11 }}>{row.traffic}</td>
                  {["Plaud","Otter.ai","Notion AI","reMarkable"].map(co => {
                    const count = data.filter((d:any)=>(d.co||d.company)===co&&d.outlet===row.outlet).length;
                    return (
                      <td key={co} style={{ textAlign: "center", padding: "8px 10px" }}>
                        {count>0
                          ? <span style={{ background: coColors[co]+"33", color: coColors[co], borderRadius: 6, padding: "2px 10px", fontWeight: 700 }}>{count}</span>
                          : <span style={{ color: BORDER }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Brand Awareness ─────────────────────────────────────────
function BrandAwarenessModule() {
  const [keywordData, setKeywordData] = useState<any[]>([]);
  const [pageData,    setPageData]    = useState<any[]>([]);
  const [uploadedAt,  setUploadedAt]  = useState<string|null>(null);
  const [dragging,    setDragging]    = useState(false);

  // GA4 列名标准化：把长列名映射为短列名
  const normalizeRow = (row: any): any => {
    const out: any = {};
    for (const [k, v] of Object.entries(row)) {
      const kl = k.toLowerCase();
      if (kl.includes("query") || kl.includes("search term"))        out["Query"]       = v;
      else if (kl.includes("click") && !kl.includes("rate"))         out["Clicks"]      = v;
      else if (kl.includes("impression"))                             out["Impressions"] = v;
      else if (kl.includes("rate") || kl.includes("ctr"))            out["CTR"]         = v;
      else if (kl.includes("position") || kl.includes("average"))    out["Position"]    = v;
      else if (kl.includes("page") || kl.includes("screen class"))   out["Page"]        = v;
      else if (kl.includes("view"))                                   out["Views"]       = v;
      else if (kl.includes("user"))                                   out["Users"]       = v;
      else if (kl.includes("engagement") || kl.includes("time"))     out["Avg. Engagement Time"] = v;
      else out[k] = v;
    }
    return out;
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const rawRows = parseGA4CSV(text);
      if (!rawRows.length) return;
      const rows = rawRows.map(normalizeRow);
      const keys = Object.keys(rawRows[0]).map(k => k.toLowerCase());
      if (keys.some(k => k.includes("query") || k.includes("search term") || k.includes("click"))) {
        setKeywordData(rows);
      } else if (keys.some(k => k.includes("page") || k.includes("views") || k.includes("screen"))) {
        setPageData(rows);
      }
      setUploadedAt(new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }));
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(handleFile);
  };

  const hasData = keywordData.length > 0 || pageData.length > 0;
  const brandKws    = keywordData.filter(r => {
    const q = (r.Query||r.query||"").toLowerCase();
    return q.includes("plaud") || q.includes("notepin");
  });
  const nonBrandKws = keywordData.filter(r => {
    const q = (r.Query||r.query||"").toLowerCase();
    return !q.includes("plaud") && !q.includes("notepin");
  });
  const totalBrandClicks       = brandKws.reduce((s,r)=>s+(parseInt(r.Clicks||r.clicks||"0")||0),0);
  const totalBrandImpressions  = brandKws.reduce((s,r)=>s+(parseInt(r.Impressions||r.impressions||"0")||0),0);

  const keywordChart = keywordData.slice(0,10).map(r => ({
    name: (r.Query||r.query||"").length>22?(r.Query||r.query||"").slice(0,20)+"…":(r.Query||r.query||""),
    clicks: parseInt(r.Clicks||r.clicks||"0")||0,
    isBrand: (r.Query||r.query||"").toLowerCase().includes("plaud")||(r.Query||r.query||"").toLowerCase().includes("notepin"),
  }));
  const pageChart = pageData.slice(0,8).map(r => ({
    name: ((r["Page path and screen class"]||r["Page path"]||r.page||"/").replace("https://www.plaud.ai","").slice(0,25))||"/",
    views: parseInt(r.Views||r.views||r["Screen views"]||"0")||0,
    users: parseInt(r.Users||r.users||"0")||0,
  }));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Brand Awareness — GA4 Last 28 Days</div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>
              {uploadedAt ? `Last uploaded: ${uploadedAt} · Data period: last 28 days` : "Upload your GA4 CSV exports — export with Last 28 Days date range"}
            </div>
          </div>
          {hasData && (
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ background:"#10b98122", border:"1px solid #10b98144", borderRadius:8, padding:"6px 14px", color:"#10b981", fontSize:11, fontWeight:700 }}>
                Brand Clicks: {totalBrandClicks.toLocaleString()}
              </div>
              <div style={{ background:ACCENT+"22", border:`1px solid ${ACCENT}44`, borderRadius:8, padding:"6px 14px", color:ACCENT, fontSize:11, fontWeight:700 }}>
                Brand Impressions: {totalBrandImpressions.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* How to export guide */}
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#13151f", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11, color: MUTED, lineHeight: 1.8 }}>
          <div style={{ color: TEXT, fontWeight: 600, marginBottom: 6 }}>How to export from GA4 (takes ~5 min):</div>
          <div>1. <span style={{ color: CYAN }}>Keywords CSV:</span> GA4 → Reports → Acquisition → Search Console → Queries → set date to Last 28 days → Download CSV</div>
          <div>2. <span style={{ color: ACCENT }}>Pages CSV:</span> GA4 → Reports → Engagement → Pages and screens → set date to Last 28 days → Download CSV</div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={onDrop}
          onClick={()=>document.getElementById("csv-input")?.click()}
          style={{ border:`2px dashed ${dragging?ACCENT:BORDER}`, borderRadius:10, padding:"24px 20px", textAlign:"center", background:dragging?ACCENT+"11":"#13151f", transition:"all 0.15s", cursor:"pointer" }}
        >
          <div style={{ fontSize:28, marginBottom:8 }}>📂</div>
          <div style={{ color:TEXT, fontSize:13, fontWeight:600, marginBottom:4 }}>Drop CSV files here or click to upload</div>
          <div style={{ color:MUTED, fontSize:11 }}>Supports both <strong style={{color:CYAN}}>ga4-keywords.csv</strong> and <strong style={{color:ACCENT}}>ga4-pages.csv</strong> — upload one or both</div>
          <input id="csv-input" type="file" accept=".csv" multiple style={{ display:"none" }}
            onChange={e=>Array.from(e.target.files||[]).forEach(handleFile)} />
        </div>

        {/* Status */}
        <div style={{ display:"flex", gap:10, marginTop:10 }}>
          <div style={{ flex:1, background:"#13151f", border:`1px solid ${keywordData.length?CYAN+"55":BORDER}`, borderRadius:8, padding:"8px 12px", fontSize:11 }}>
            <span style={{ color:keywordData.length?"#10b981":MUTED }}>{keywordData.length?"✓":"○"}</span>
            <span style={{ color:MUTED, marginLeft:6 }}>Keywords CSV</span>
            {keywordData.length>0 && <span style={{ color:CYAN, marginLeft:6 }}>{keywordData.length} queries loaded</span>}
          </div>
          <div style={{ flex:1, background:"#13151f", border:`1px solid ${pageData.length?ACCENT+"55":BORDER}`, borderRadius:8, padding:"8px 12px", fontSize:11 }}>
            <span style={{ color:pageData.length?"#10b981":MUTED }}>{pageData.length?"✓":"○"}</span>
            <span style={{ color:MUTED, marginLeft:6 }}>Pages CSV</span>
            {pageData.length>0 && <span style={{ color:ACCENT, marginLeft:6 }}>{pageData.length} pages loaded</span>}
          </div>
        </div>
      </Card>

      {!hasData && (
        <Card>
          <div style={{ textAlign:"center", padding:"32px 0", color:MUTED }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📊</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:6, color:TEXT }}>No data uploaded yet</div>
            <div style={{ fontSize:12 }}>Follow the export guide above and drag your CSV files into the upload area.</div>
          </div>
        </Card>
      )}

      {hasData && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            <MetricTile label="Brand Queries"     value={String(brandKws.length)}             sub="plaud / notepin terms"  />
            <MetricTile label="Brand Clicks"      value={totalBrandClicks.toLocaleString()}   trend="up" sub="last 28 days" />
            <MetricTile label="Brand Impressions" value={totalBrandImpressions.toLocaleString()} trend="up" sub="last 28 days" />
            <MetricTile label="Non-Brand Queries" value={String(nonBrandKws.length)}          sub="category keywords"      />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {keywordChart.length>0 && (
              <Card>
                <CardTitle sub="Brand keywords (purple) vs non-brand — last 28 days">Search Query Performance</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={keywordChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                    <XAxis dataKey="name" stroke={MUTED} fontSize={9} angle={-20} textAnchor="end" height={50} />
                    <YAxis stroke={MUTED} fontSize={10} />
                    <Tooltip contentStyle={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:8 }} />
                    <Bar dataKey="clicks" name="Clicks" radius={[3,3,0,0]}>
                      {keywordChart.map((entry,i) => <Cell key={i} fill={entry.isBrand?ACCENT:MUTED} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
            {pageChart.length>0 && (
              <Card>
                <CardTitle sub="Top pages by views — last 28 days">Top Pages</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={pageChart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                    <XAxis type="number" stroke={MUTED} fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke={MUTED} fontSize={9} width={110} />
                    <Tooltip contentStyle={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:8 }} />
                    <Legend wrapperStyle={{ fontSize:11 }} />
                    <Bar dataKey="views" fill={CYAN}   name="Views" radius={[0,4,4,0]} />
                    <Bar dataKey="users" fill={ACCENT} name="Users" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {keywordData.length>0 && (
            <Card>
              <CardTitle sub="Full search query breakdown — last 28 days">Search Query Details</CardTitle>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${BORDER}` }}>
                      {["Query","Clicks","Impressions","CTR","Avg. Position","Type"].map(h=>(
                        <th key={h} style={{ color:MUTED, padding:"6px 10px", textAlign:h==="Query"?"left":"center", fontWeight:600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keywordData.slice(0,15).map((r,i)=>{
                      const isBrand=(r.Query||r.query||"").toLowerCase().includes("plaud")||(r.Query||r.query||"").toLowerCase().includes("notepin");
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid ${BORDER}22`, background:isBrand?ACCENT+"08":"transparent" }}>
                          <td style={{ color:TEXT,   padding:"8px 10px", fontWeight:600 }}>{r.Query||r.query}</td>
                          <td style={{ color:ACCENT, padding:"8px 10px", textAlign:"center", fontWeight:700 }}>{r.Clicks||r.clicks}</td>
                          <td style={{ color:MUTED,  padding:"8px 10px", textAlign:"center" }}>{r.Impressions||r.impressions}</td>
                          <td style={{ color:CYAN,   padding:"8px 10px", textAlign:"center" }}>{r.CTR||r.ctr}</td>
                          <td style={{ color:TEXT,   padding:"8px 10px", textAlign:"center" }}>{r.Position||r.position}</td>
                          <td style={{ padding:"8px 10px", textAlign:"center" }}>
                            <span style={{ background:isBrand?ACCENT+"33":"#2a2d3a", color:isBrand?ACCENT:MUTED, borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:600 }}>
                              {isBrand?"Brand":"Non-Brand"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {pageData.length>0 && (
            <Card>
              <CardTitle sub="Top 10 pages by views — last 28 days">Page Performance Details</CardTitle>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${BORDER}` }}>
                      {["Page","Views","Users","Avg. Engagement Time"].map(h=>(
                        <th key={h} style={{ color:MUTED, padding:"6px 10px", textAlign:h==="Page"?"left":"center", fontWeight:600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.slice(0,10).map((r,i)=>(
                      <tr key={i} style={{ borderBottom:`1px solid ${BORDER}22` }}>
                        <td style={{ color:CYAN,   padding:"8px 10px", fontWeight:600, fontSize:11 }}>
                          {(r["Page path and screen class"]||r["Page path"]||r.page||"/").replace("https://www.plaud.ai","")}
                        </td>
                        <td style={{ color:ACCENT, padding:"8px 10px", textAlign:"center", fontWeight:700 }}>{(parseInt(r.Views||r.views||"0")||0).toLocaleString()}</td>
                        <td style={{ color:TEXT,   padding:"8px 10px", textAlign:"center" }}>{(parseInt(r.Users||r.users||"0")||0).toLocaleString()}</td>
                        <td style={{ color:MUTED,  padding:"8px 10px", textAlign:"center" }}>{r["Average engagement time"]||r["Avg. engagement time"]||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────
export default function Dashboard({ initialInsights, initialCoverage, initialMetrics, generatedAt, weekNumber }: DashboardProps) {
  const [tab, setTab] = useState(0);
  const tabs = ["📊 Pulse","🧭 Narrative","⚔️ Competitive","🎯 Action","🧠 AI Insights","📰 Tier 1 Coverage","📈 Brand Awareness"];

  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif", color: TEXT }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>P</div>
          <div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 15 }}>Plaud Brand & PR Intelligence System</div>
            <div style={{ color: MUTED, fontSize: 11 }}>
              {generatedAt ? `Updated ${new Date(generatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} · Week ${weekNumber}` : "PR Control Tower · Auto-updates every Thursday"}
            </div>
          </div>
        </div>
        <div style={{ background: "#10b98122", border: "1px solid #10b98144", borderRadius: 6, padding: "4px 10px", color: "#10b981", fontSize: 11, fontWeight: 600 }}>● Live</div>
      </div>
      <div style={{ padding: "0 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 2, overflowX: "auto" }}>
        {tabs.map((t,i) => (
          <button key={i} onClick={()=>setTab(i)} style={{ background: "none", border: "none", borderBottom: tab===i?"2px solid #6366f1":"2px solid transparent", color: tab===i?TEXT:MUTED, padding: "12px 16px", fontSize: 12, fontWeight: tab===i?700:400, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {tab===0 && <PulseModule    metrics={initialMetrics} />}
        {tab===1 && <NarrativeModule />}
        {tab===2 && <CompetitiveModule />}
        {tab===3 && <ActionModule />}
        {tab===4 && <AIInsightsModule initialInsights={initialInsights} generatedAt={generatedAt} weekNumber={weekNumber} />}
        {tab===5 && <Tier1Module coverage={initialCoverage||[]} />}
        {tab===6 && <BrandAwarenessModule />}
      </div>
    </div>
  );
}