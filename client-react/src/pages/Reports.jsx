import { useState } from "react";
import { useData } from "../context/DataContext";
import { api, apiDownload } from "../services/apiService";

function Reports() {
  const { uploadId } = useData();

  // ── TRACE ──
  console.log("[Reports] render — uploadId:", uploadId);

  const [report, setReport]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState("");

  const loadReport = async () => {
    console.log("[Reports] loadReport called — uploadId:", uploadId);
    if (!uploadId) { setError("No dataset loaded. Upload a file on the Dashboard first."); return; }
    setError(""); setLoading(true);
    try {
      const data = await api.report(uploadId);
      console.log("[Reports] /report response:", data);
      setReport(data);
    } catch (err) {
      console.error("[Reports] /report error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!uploadId) { setError("No dataset loaded."); return; }
    setDownloading(true);
    try {
      const blob = await apiDownload("/download-report", { upload_id: uploadId });
      triggerDownload(blob, "analytics_report.pdf");
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Analytics Report</h1>
          <p style={s.headerSub}>Auto-generated EDA report with statistical summary</p>
        </div>
        <div style={s.headerActions}>
          <ActionButton
            onClick={loadReport}
            disabled={loading || !uploadId}
            loading={loading}
            loadingLabel="Loading report…"
            icon={<RefreshIcon />}
            label="Generate Report"
          />
          <OutlineButton
            onClick={downloadPDF}
            disabled={downloading || !report}
            loading={downloading}
            loadingLabel="Downloading…"
            icon={<DocIcon />}
            label="Download PDF"
          />
        </div>
      </div>

      {/* No upload yet */}
      {!uploadId && (
        <InfoBanner message="Upload a dataset on the Dashboard, then click Generate Report." />
      )}

      {error && <ErrorBanner message={error} />}

      {!report && !loading && uploadId && (
        <EmptyState
          icon={<DocIcon size={40} />}
          title="No report generated"
          text="Click Generate Report to create an automated EDA summary."
        />
      )}

      {loading && <LoadingCard message="Loading report…" />}

      {report && (
        <>
          <div style={s.overviewGrid}>
            {[
              { label: "Total Rows",     val: report.rows?.toLocaleString(),             color: "var(--color-royal)",  bg: "rgba(29,78,216,0.07)"  },
              { label: "Total Columns",  val: report.columns,                            color: "var(--color-indigo)", bg: "rgba(79,70,229,0.07)"  },
              { label: "Missing Values", val: report.missing_values?.toLocaleString(),   color: report.missing_values > 0 ? "var(--color-warning)" : "var(--color-success)", bg: report.missing_values > 0 ? "var(--color-warning-bg)" : "var(--color-success-bg)" },
              { label: "Duplicates",     val: report.duplicates?.toLocaleString(),       color: report.duplicates     > 0 ? "var(--color-danger)"  : "var(--color-success)", bg: report.duplicates     > 0 ? "var(--color-danger-bg)"  : "var(--color-success-bg)" },
            ].map((m) => (
              <div key={m.label} style={{ ...s.metricCard, background: m.bg }}>
                <div style={{ ...s.metricVal, color: m.color }}>{m.val}</div>
                <div style={s.metricLabel}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={s.reportLayout}>
            {/* Numeric columns list */}
            <div style={s.card}>
              <div style={s.cardTitle}>Numeric Columns</div>
              {report.numeric_columns?.length > 0 ? (
                <div style={s.colList}>
                  {report.numeric_columns.map((col) => (
                    <div key={col} style={s.colItem}>
                      <span style={s.colDot} /><span style={s.colName}>{col}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={s.noData}>No numeric columns found.</div>
              )}
            </div>

            {/* Summary statistics table */}
            {report.summary && Object.keys(report.summary).length > 0 && (
              <div style={s.card}>
                <div style={s.cardTitle}>Statistical Summary</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={s.statTable}>
                    <thead>
                      <tr>
                        {["Column", "Mean", "Min", "Max", "Std Dev"].map((h) => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(report.summary).map((col) => {
                        const st   = report.summary[col];
                        const fmt  = (v) => v != null ? Number(v).toFixed(2) : "—";
                        return (
                          <tr key={col} style={s.tr}>
                            <td style={s.tdBold}>{col}</td>
                            <td style={s.td}>{fmt(st.mean)}</td>
                            <td style={s.td}>{fmt(st.min)}</td>
                            <td style={s.td}>{fmt(st.max)}</td>
                            <td style={s.td}>{fmt(st.std)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Shared UI helpers (local, not exported) ──────────────────────────────────
function ActionButton({ onClick, disabled, loading, loadingLabel, icon, label }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...s.btn, ...(disabled ? s.btnDisabled : {}) }}>
      {loading ? <><Spinner /> {loadingLabel}</> : <>{icon} {label}</>}
    </button>
  );
}

function OutlineButton({ onClick, disabled, loading, loadingLabel, icon, label }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...s.btnOutline, ...(disabled ? s.btnDisabled : {}) }}>
      {loading ? loadingLabel : <>{icon} {label}</>}
    </button>
  );
}

function InfoBanner({ message }) {
  return <div style={s.infoBanner}>{message}</div>;
}

function ErrorBanner({ message }) {
  return <div style={s.errorBox}>{message}</div>;
}

function LoadingCard({ message }) {
  return (
    <div style={s.loadingCard}>
      <Spinner /> <span style={{ marginLeft: 10 }}>{message}</span>
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div style={s.emptyState}>
      <div style={s.emptyIcon}>{icon}</div>
      <div style={s.emptyTitle}>{title}</div>
      <div style={s.emptyText}>{text}</div>
    </div>
  );
}

function Spinner() {
  return <span style={s.spinner} />;
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.12" />
    </svg>
  );
}

function DocIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { padding: 32, maxWidth: 1400 },
  header: {
    background: "linear-gradient(135deg,#0F1E3C 0%,#1E3A5F 40%,#1D4ED8 100%)",
    borderRadius: "var(--border-radius-xl)", padding: "28px 32px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 16, overflow: "hidden",
  },
  headerTitle:   { color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" },
  headerSub:     { color: "rgba(255,255,255,0.60)", fontSize: "var(--font-size-sm)", marginTop: 5 },
  headerActions: { display: "flex", gap: 12, flexWrap: "wrap" },
  btn: {
    padding: "11px 20px", background: "var(--gradient-primary)", color: "white",
    border: "none", borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 700, fontFamily: "var(--font-family)",
    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 4px 14px rgba(29,78,216,0.30)", whiteSpace: "nowrap",
  },
  btnOutline: {
    padding: "11px 20px", background: "rgba(255,255,255,0.10)", color: "white",
    border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 700, fontFamily: "var(--font-family)",
    cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
  },
  btnDisabled:  { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" },
  spinner: {
    display: "inline-block", width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white",
    borderRadius: "50%", animation: "spin 0.75s linear infinite",
  },
  infoBanner: {
    padding: "12px 16px", background: "rgba(6,182,212,0.08)", color: "#0e7490",
    border: "1px solid rgba(6,182,212,0.25)", borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 500, marginBottom: 20,
  },
  errorBox: {
    padding: "12px 16px", background: "var(--color-danger-bg)", color: "#991b1b",
    border: "1px solid rgba(239,68,68,0.20)", borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 500, marginBottom: 20,
  },
  loadingCard: {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 40, background: "white", borderRadius: "var(--border-radius-lg)",
    border: "1px solid var(--color-slate-200)", fontSize: "var(--font-size-sm)",
    color: "var(--color-slate-600)",
  },
  overviewGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 },
  metricCard:  { borderRadius: "var(--border-radius-md)", padding: 20, border: "1px solid transparent" },
  metricVal:   { fontSize: 30, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 6 },
  metricLabel: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.07em" },
  reportLayout:{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 },
  card: { background: "white", borderRadius: "var(--border-radius-lg)", padding: 24, border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-md)" },
  cardTitle:   { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 18 },
  colList:     { display: "flex", flexDirection: "column", gap: 8 },
  colItem:     { display: "flex", alignItems: "center", gap: 10 },
  colDot:      { width: 7, height: 7, borderRadius: "50%", background: "var(--color-royal)", flexShrink: 0 },
  colName:     { fontSize: "var(--font-size-sm)", color: "var(--color-slate-700)", fontWeight: 500 },
  noData:      { fontSize: "var(--font-size-sm)", color: "var(--color-slate-400)" },
  statTable:   { width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-sm)" },
  th:          { padding: "10px 14px", background: "var(--color-navy)", color: "rgba(255,255,255,0.85)", fontSize: "var(--font-size-xs)", fontWeight: 700, textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr:          { borderBottom: "1px solid var(--color-slate-100)" },
  td:          { padding: "10px 14px", color: "var(--color-slate-700)", textAlign: "right" },
  tdBold:      { padding: "10px 14px", color: "var(--color-slate-900)", fontWeight: 600 },
  emptyState:  { textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "var(--border-radius-xl)", border: "1px solid var(--color-slate-200)" },
  emptyIcon:   { width: 72, height: 72, borderRadius: 20, background: "rgba(29,78,216,0.07)", color: "var(--color-royal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  emptyTitle:  { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-800)", marginBottom: 8 },
  emptyText:   { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)" },
};

export default Reports;
