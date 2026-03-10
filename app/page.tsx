import Dashboard from "@/components/Dashboard";
import fs from "fs";
import path from "path";

export default function Home() {
  let snapshot = null;
  try {
    const filePath = path.join(process.cwd(), "data", "weekly.json");
    snapshot = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {}

  return (
    <main>
      <Dashboard
        initialInsights={snapshot?.insights ?? null}
        initialCoverage={snapshot?.coverage ?? null}
        initialMetrics={snapshot?.metrics ?? null}
        generatedAt={snapshot?.generatedAt ?? null}
        weekNumber={snapshot?.weekNumber ?? null}
      />
    </main>
  );
}