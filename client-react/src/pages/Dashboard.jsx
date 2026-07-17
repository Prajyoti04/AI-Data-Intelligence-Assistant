import { useData } from "../context/DataContext";
import MetricCard  from "../components/MetricCard";
import UploadBox   from "../components/UploadBox";
import DataPreview from "../components/DataPreview";

/**
 * Dashboard — reads all state from context.
 * No props accepted; no state duplicated locally.
 * stats and preview now survive page navigation because they live in context.
 */
function Dashboard() {
  const { stats, preview, uploadId } = useData();
  const hasData = stats.rows > 0;

  return (
    <div style={styles.page}>
      {/* Hero header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.badge}>
            <span style={styles.liveDot} />
            Live Platform
          </div>
          <h1 style={styles.title}>AI Data Intelligence Platform</h1>
          <p style={styles.subtitle}>
            Upload your dataset to unlock automated analytics, ML predictions, and AI-powered insights.
          </p>
        </div>
        <div style={styles.orbs}>
          <div style={styles.orb1} />
          <div style={styles.orb2} />
        </div>
      </div>

      {/* Metric cards */}
      <div style={styles.metricsGrid}>
        {[
          { title: "Rows",           value: stats.rows           },
          { title: "Columns",        value: stats.columns        },
          { title: "Missing Values", value: stats.missing_values },
          { title: "Duplicates",     value: stats.duplicates     },
        ].map((m) => <MetricCard key={m.title} title={m.title} value={m.value} />)}
      </div>

      {/* Upload box — no props needed, it reads context internally */}
      <UploadBox />

      {/* Quick-start tips shown before any upload */}
      {!hasData && (
        <div style={styles.tipsGrid}>
          {TIPS.map((tip) => (
            <div key={tip.title} style={styles.tipCard}>
              <div style={styles.tipIcon}>{tip.icon}</div>
              <div style={styles.tipTitle}>{tip.title}</div>
              <div style={styles.tipText}>{tip.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Dataset preview */}
      {hasData && <DataPreview data={preview} />}

      {/* Upload-id indicator (dev aid — remove in production if desired) */}
      {uploadId && (
        <div style={styles.idPill} title="Session upload ID">
          <span style={styles.idDot} />
          Session active
        </div>
      )}
    </div>
  );
}

// ── Quick-start tips ────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    title: "Upload Dataset",
    text:  "Drag & drop a CSV or Excel file. Structure, types, and statistics are detected automatically.",
  },
  {
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    title: "Explore Visualizations",
    text:  "Generate interactive bar, pie, and scatter charts plus a correlation heatmap instantly.",
  },
  {
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
    title: "AutoML Predictions",
    text:  "Pick any numeric column as target and get Linear Regression predictions instantly.",
  },
  {
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: "Download PDF Report",
    text:  "Export a professional analytics report with summary statistics and column insights.",
  },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: { padding: 32, maxWidth: 1400 },
  header: {
    background: "linear-gradient(135deg,#0F1E3C 0%,#1E3A5F 40%,#1D4ED8 100%)",
    borderRadius: "var(--border-radius-xl)",
    padding: "36px 40px", marginBottom: 28,
    position: "relative", overflow: "hidden",
  },
  headerContent: { position: "relative", zIndex: 2 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "5px 14px",
    background: "rgba(6,182,212,0.18)", border: "1px solid rgba(6,182,212,0.35)",
    borderRadius: 999,
    fontSize: "var(--font-size-xs)", fontWeight: 700,
    color: "var(--color-cyan-light)", letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: 16,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "var(--color-cyan)", boxShadow: "0 0 6px var(--color-cyan)",
    display: "inline-block",
  },
  title:    { color: "white", fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 12 },
  subtitle: { color: "rgba(255,255,255,0.65)", fontSize: "var(--font-size-md)", maxWidth: 560, lineHeight: 1.65 },
  orbs: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 },
  orb1: { position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(6,182,212,0.12)", filter: "blur(40px)" },
  orb2: { position: "absolute", bottom: -80, right: 160, width: 300, height: 300, borderRadius: "50%", background: "rgba(79,70,229,0.14)", filter: "blur(50px)" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 },
  tipsGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 8 },
  tipCard: {
    background: "white", borderRadius: "var(--border-radius-lg)", padding: 24,
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-sm)",
  },
  tipIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: "linear-gradient(135deg,rgba(29,78,216,0.08),rgba(6,182,212,0.10))",
    color: "var(--color-royal)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  tipTitle: { fontSize: "var(--font-size-md)", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: 8 },
  tipText:  { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", lineHeight: 1.65 },
  idPill: {
    display: "inline-flex", alignItems: "center", gap: 7,
    marginTop: 20, padding: "5px 14px",
    background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.15)",
    borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--color-royal)",
  },
  idDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-royal)", display: "inline-block" },
};

export default Dashboard;
