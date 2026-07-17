import { useState } from "react";
import { useData } from "../context/DataContext";
import { api, apiDownload } from "../services/apiService";

function DataCleaning() {
  const { uploadId, stats } = useData();

  // ── TRACE ──
  console.log("[DataCleaning] render — uploadId:", uploadId, "| stats.rows:", stats?.rows);

  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState("");

  const cleanDataset = async () => {
    if (!uploadId) { setError("No dataset loaded. Upload a file on the Dashboard first."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const data = await api.clean(uploadId);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCleaned = async () => {
    if (!uploadId) { setError("No dataset loaded."); return; }
    setDownloading(true);
    try {
      const blob = await apiDownload("/download-cleaned", { upload_id: uploadId });
      triggerDownload(blob, "cleaned_dataset.csv");
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const STEPS = [
    { n: "1", title: "Remove Duplicates",  desc: "Identifies and drops exact duplicate rows." },
    { n: "2", title: "Fill Numeric Nulls", desc: "Replaces missing numeric values with column mean." },
    { n: "3", title: "Fill Text Nulls",    desc: "Replaces missing text values with the column mode." },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Data Cleaning Studio</h1>
          <p style={s.headerSub}>Automated preprocessing — duplicates, missing values, imputation</p>
        </div>
        {stats.rows > 0 && (
          <div style={s.statsBadge}>
            <span style={s.statsVal}>{stats.rows.toLocaleString()}</span>
            <span style={s.statsLabel}>Loaded Records</span>
          </div>
        )}
      </div>

      <div style={s.layout}>
        {/* Pipeline */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Cleaning Pipeline</div>

          {STEPS.map((step) => (
            <div key={step.n} style={s.stepRow}>
              <div style={s.stepNum}>{step.n}</div>
              <div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}

          {!uploadId && (
            <div style={s.infoBanner}>
              Upload a dataset on the Dashboard to enable cleaning.
            </div>
          )}

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.actionRow}>
            <button
              onClick={cleanDataset}
              disabled={loading || !uploadId}
              style={{ ...s.btn, ...(loading || !uploadId ? s.btnDisabled : {}) }}
            >
              {loading
                ? <><span style={s.spinner} /> Cleaning dataset…</>
                : <><WaveIcon /> Run Cleaning Pipeline</>}
            </button>

            <button
              onClick={downloadCleaned}
              disabled={downloading || !result}
              style={{ ...s.btnOutline, ...(downloading || !result ? s.btnDisabled : {}) }}
            >
              {downloading
                ? "Downloading…"
                : <><DownloadIcon /> Download CSV</>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={s.card}>
          {result ? (
            <>
              <div style={s.resultHeader}>
                <div style={s.resultIcon}><CheckIcon /></div>
                <div>
                  <div style={s.resultTitle}>Cleaning Complete</div>
                  <div style={s.resultSubtitle}>Your dataset has been cleaned successfully</div>
                </div>
              </div>

              <div style={s.resultGrid}>
                {[
                  { label: "Rows Before",        val: result.rows_before?.toLocaleString(),        color: "var(--color-royal)"   },
                  { label: "Rows After",          val: result.rows_after?.toLocaleString(),         color: "var(--color-success)" },
                  { label: "Duplicates Removed",  val: result.duplicates_removed?.toLocaleString(), color: "var(--color-danger)"  },
                  {
                    label: "Missing After",
                    val:   result.missing_after?.toLocaleString(),
                    color: result.missing_after === 0 ? "var(--color-success)" : "var(--color-warning)",
                  },
                ].map((item) => (
                  <div key={item.label} style={s.resultMetric}>
                    <div style={{ ...s.metricVal, color: item.color }}>{item.val}</div>
                    <div style={s.metricLabel}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={s.successNote}>
                Dataset updated in memory. Download the CSV to save it locally.
              </div>
            </>
          ) : (
            <div style={s.emptyResult}>
              <div style={s.emptyIcon}><WaveIcon size={36} /></div>
              <div style={s.emptyTitle}>Ready to clean</div>
              <div style={s.emptyText}>Run the pipeline to remove duplicates and fill missing values automatically.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function WaveIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { padding: 32, maxWidth: 1200 },
  header: {
    background: "linear-gradient(135deg,#0F1E3C 0%,#1E3A5F 40%,#1D4ED8 100%)",
    borderRadius: "var(--border-radius-xl)", padding: "28px 32px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 16, overflow: "hidden",
  },
  headerTitle: { color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" },
  headerSub:   { color: "rgba(255,255,255,0.60)", fontSize: "var(--font-size-sm)", marginTop: 5 },
  statsBadge:  { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--border-radius-md)", padding: "12px 20px" },
  statsVal:    { fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1 },
  statsLabel:  { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 },
  layout:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" },
  card: { background: "white", borderRadius: "var(--border-radius-lg)", padding: 28, border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-md)", minHeight: 300 },
  sectionTitle: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 20 },
  stepRow:  { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 },
  stepNum:  { width: 30, height: 30, borderRadius: 8, background: "var(--gradient-primary)", color: "white", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 8px rgba(29,78,216,0.25)" },
  stepTitle: { fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-slate-800)", marginBottom: 3 },
  stepDesc:  { fontSize: "var(--font-size-xs)", color: "var(--color-slate-500)", lineHeight: 1.55 },
  infoBanner: { padding: "10px 14px", background: "rgba(6,182,212,0.08)", color: "#0e7490", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 500, marginBottom: 16 },
  errorBox:  { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--color-danger-bg)", color: "#991b1b", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 500, marginBottom: 16, border: "1px solid rgba(239,68,68,0.25)" },
  actionRow: { display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" },
  btn: { flex: 1, padding: "11px 16px", background: "var(--gradient-primary)", color: "white", border: "none", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 700, fontFamily: "var(--font-family)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(29,78,216,0.28)" },
  btnOutline: { flex: 1, padding: "11px 16px", background: "white", color: "var(--color-success)", border: "1.5px solid var(--color-success)", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 700, fontFamily: "var(--font-family)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed", boxShadow: "none" },
  spinner: { display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.75s linear infinite" },
  resultHeader:   { display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: 16, background: "var(--color-success-bg)", borderRadius: "var(--border-radius-md)", border: "1px solid rgba(16,185,129,0.25)" },
  resultIcon:     { width: 44, height: 44, borderRadius: 12, background: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  resultTitle:    { fontSize: "var(--font-size-md)", fontWeight: 700, color: "#065f46" },
  resultSubtitle: { fontSize: "var(--font-size-xs)", color: "#047857", marginTop: 2 },
  resultGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  resultMetric:  { background: "var(--color-slate-50)", borderRadius: "var(--border-radius-md)", padding: 16, border: "1px solid var(--color-slate-200)", textAlign: "center" },
  metricVal:     { fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 6 },
  metricLabel:   { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.06em" },
  successNote:   { fontSize: "var(--font-size-xs)", color: "var(--color-slate-500)", background: "var(--color-slate-50)", padding: "10px 14px", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-slate-200)" },
  emptyResult:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 260, textAlign: "center", gap: 16 },
  emptyIcon:     { width: 72, height: 72, borderRadius: 20, background: "rgba(29,78,216,0.07)", color: "var(--color-royal)", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyTitle:    { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-700)" },
  emptyText:     { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", maxWidth: 280 },
};

export default DataCleaning;
