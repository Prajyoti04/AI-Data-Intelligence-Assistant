import { useData } from "../context/DataContext";

/**
 * AIInsights — reads everything from context. No props.
 */
function AIInsights() {
  const { stats, dataset, correlationMatrix, recommendedTask } = useData();

  if (!stats.rows) return null;

  // Compute quality score from context stats
  const totalCells  = stats.rows * stats.columns;
  const qualityScore = totalCells > 0
    ? Math.max(0, 100 - Math.round((stats.missing_values / totalCells) * 100))
    : 100;

  const qualityColor = qualityScore >= 90 ? "var(--color-success)" : qualityScore >= 70 ? "var(--color-warning)" : "var(--color-danger)";
  const qualityLabel = qualityScore >= 90 ? "Excellent" : qualityScore >= 70 ? "Good" : "Needs Cleaning";

  // Strongest correlation pair
  let strongestPair  = "N/A";
  let strongestValue = 0;
  if (correlationMatrix && Object.keys(correlationMatrix).length > 0) {
    Object.keys(correlationMatrix).forEach((row) => {
      Object.keys(correlationMatrix[row] ?? {}).forEach((col) => {
        const v = Math.abs(correlationMatrix[row][col]);
        if (row !== col && v > strongestValue) { strongestValue = v; strongestPair = `${row} ↔ ${col}`; }
      });
    });
  }

  const CARDS = [
    { label: "Total Records", value: stats.rows.toLocaleString(),    sub: "rows",     color: "var(--color-royal)",   bg: "rgba(29,78,216,0.07)",   icon: <RowsIcon />  },
    { label: "Total Columns", value: stats.columns,                   sub: "features", color: "var(--color-indigo)",  bg: "rgba(79,70,229,0.07)",   icon: <GridIcon />  },
    { label: "Missing Values",value: stats.missing_values.toLocaleString(), sub: "cells", color: stats.missing_values > 0 ? "var(--color-warning)" : "var(--color-success)", bg: stats.missing_values > 0 ? "var(--color-warning-bg)" : "var(--color-success-bg)", icon: <AlertIcon /> },
    { label: "Data Quality",  value: `${qualityScore}%`,              sub: qualityLabel, color: qualityColor,        bg: qualityScore >= 90 ? "var(--color-success-bg)" : qualityScore >= 70 ? "var(--color-warning-bg)" : "var(--color-danger-bg)", icon: <CheckIcon /> },
  ];

  return (
    <div>
      <div style={s.titleRow}>
        <div>
          <div style={s.title}>AI Dataset Insights</div>
          <div style={s.subtitle}>Automated analysis of your uploaded dataset</div>
        </div>
        {recommendedTask && (
          <div style={s.taskBadge}>
            <span style={s.taskDot} />
            Recommended: {recommendedTask.task}
          </div>
        )}
      </div>

      <div style={s.grid}>
        {CARDS.map((c) => (
          <div key={c.label} style={{ ...s.card, background: c.bg }}>
            <div style={{ ...s.cardIcon, color: c.color }}>{c.icon}</div>
            <div style={s.cardValue}>{c.value}</div>
            <div style={s.cardLabel}>{c.label}</div>
            <div style={{ ...s.cardSub, color: c.color }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.panel}>
        <div style={s.panelLeft}>
          <div style={s.panelTitle}>AI Summary</div>
          <SummaryRow label="Dataset Size"      value={`${stats.rows.toLocaleString()} rows × ${stats.columns} columns`} />
          <SummaryRow label="Missing Data"      value={`${stats.missing_values} cells (${(100 - qualityScore).toFixed(1)}%)`} />
          <SummaryRow label="ML Suitability"    value={stats.rows > 100 ? "Sufficient for Machine Learning" : "Small dataset — limited ML scope"} />
          {strongestPair !== "N/A" && (
            <SummaryRow label="Strongest Correlation" value={`${strongestPair} (${strongestValue.toFixed(2)})`} />
          )}
        </div>

        {recommendedTask && (
          <div style={s.algoBox}>
            <div style={s.algoTitle}>Suggested Algorithms</div>
            <div style={s.algoTask}>{recommendedTask.task}</div>
            <div style={s.algoList}>
              {recommendedTask.algorithms.map((a) => (
                <span key={a} style={s.algoPill}>{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-cyan)", marginTop: 6, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: "var(--font-size-xs)", fontWeight: 700, color: "rgba(255,255,255,0.50)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, color: "rgba(255,255,255,0.90)" }}>{value}</div>
      </div>
    </div>
  );
}

const RowsIcon  = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const GridIcon  = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>;
const AlertIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const CheckIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

const s = {
  titleRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  title:    { fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-slate-900)" },
  subtitle: { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", marginTop: 3 },
  taskBadge: { display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", background: "rgba(29,78,216,0.08)", color: "var(--color-royal)", border: "1px solid rgba(29,78,216,0.20)", borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 700, letterSpacing: "0.04em" },
  taskDot:  { width: 6, height: 6, borderRadius: "50%", background: "var(--color-royal-light)", display: "inline-block" },
  grid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 },
  card:     { padding: 18, borderRadius: "var(--border-radius-md)", border: "1px solid transparent" },
  cardIcon: { marginBottom: 10, display: "flex" },
  cardValue: { fontSize: 26, fontWeight: 800, color: "var(--color-slate-900)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6 },
  cardLabel: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 },
  cardSub:   { fontSize: "var(--font-size-xs)", fontWeight: 600 },
  panel:     { background: "linear-gradient(135deg,var(--color-navy) 0%,var(--color-navy-light) 100%)", borderRadius: "var(--border-radius-lg)", padding: 24, display: "flex", gap: 28, flexWrap: "wrap" },
  panelLeft: { flex: "1 1 280px" },
  panelTitle:{ fontSize: "var(--font-size-md)", fontWeight: 700, color: "white", marginBottom: 16, letterSpacing: "-0.01em" },
  algoBox:   { flex: "0 1 220px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "var(--border-radius-md)", padding: 18 },
  algoTitle: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
  algoTask:  { fontSize: "var(--font-size-md)", fontWeight: 700, color: "var(--color-cyan-light)", marginBottom: 14 },
  algoList:  { display: "flex", flexDirection: "column", gap: 7 },
  algoPill:  { padding: "6px 12px", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 7, fontSize: "var(--font-size-xs)", fontWeight: 600, color: "rgba(255,255,255,0.85)" },
};

export default AIInsights;
