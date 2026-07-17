import { useState } from "react";
import { useData } from "../context/DataContext";
import { api } from "../services/apiService";

function Predictions() {
  const { uploadId, numericColumns } = useData();

  // ── TRACE ──
  console.log("[Predictions] render — uploadId:", uploadId, "| numericColumns:", numericColumns);

  const [target, setPredTarget]   = useState("");
  const [inputs, setInputs]       = useState({});
  const [prediction, setPrediction] = useState(null);
  const [features, setFeatures]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const featureCols = numericColumns.filter((c) => c !== target);

  const runPrediction = async () => {
    if (!target)    { setError("Please select a target column."); return; }
    if (!uploadId)  { setError("No dataset loaded. Upload a file on the Dashboard first."); return; }

    const missing = featureCols.filter((c) => inputs[c] === undefined || inputs[c] === "");
    if (missing.length > 0) { setError(`Please fill in values for: ${missing.join(", ")}`); return; }

    setError(""); setLoading(true); setPrediction(null);
    try {
      const data = await api.predict(uploadId, target, inputs);
      setPrediction(data.prediction);
      setFeatures(data.features ?? featureCols);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTargetChange = (val) => {
    setPredTarget(val); setPrediction(null); setError(""); setInputs({});
  };

  if (!uploadId || numericColumns.length === 0) {
    return (
      <div style={s.page}>
        <PageHeader numericCount={0} />
        <div style={s.emptyState}>
          <div style={s.emptyIcon}><PredictIcon size={40} /></div>
          <div style={s.emptyTitle}>No dataset loaded</div>
          <div style={s.emptyText}>Upload a dataset with numeric columns on the Dashboard to enable predictions.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <PageHeader numericCount={numericColumns.length} />

      <div style={s.layout}>
        {/* Config panel */}
        <div style={s.card}>
          <SectionLabel>Model Configuration</SectionLabel>

          <div style={s.formGroup}>
            <label style={s.label}>Target Column (predict this)</label>
            <select value={target} onChange={(e) => handleTargetChange(e.target.value)} style={s.select}>
              <option value="">Select target column…</option>
              {numericColumns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {target && (
            <div style={s.infoBox}>
              {[
                { k: "Target",    v: target },
                { k: "Features",  v: `${featureCols.length} columns` },
                { k: "Algorithm", v: "Linear Regression" },
              ].map(({ k, v }) => (
                <div key={k} style={s.infoRow}>
                  <span style={s.infoKey}>{k}</span>
                  <span style={s.infoVal}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {target && featureCols.length > 0 && (
            <>
              <SectionLabel>Feature Inputs</SectionLabel>
              {featureCols.map((col) => (
                <div key={col} style={s.formGroup}>
                  <label style={s.label}>{col}</label>
                  <input
                    type="number"
                    placeholder={`Enter ${col}…`}
                    style={s.input}
                    value={inputs[col] ?? ""}
                    onChange={(e) => setInputs({ ...inputs, [col]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </>
          )}

          {error && <div style={s.errorBox}>{error}</div>}

          <button
            onClick={runPrediction}
            disabled={loading || !target}
            style={{ ...s.btn, ...(loading || !target ? s.btnDisabled : {}) }}
          >
            {loading
              ? <><span style={s.spinner} /> Generating prediction…</>
              : <><PlayIcon /> Run Prediction</>}
          </button>
        </div>

        {/* Result panel */}
        <div style={s.card}>
          {prediction !== null ? (
            <>
              <div style={s.resultLabel}>Predicted {target}</div>
              <div style={s.resultValue}>{Number(prediction).toLocaleString()}</div>
              <div style={s.resultSub}>
                Based on {features.length} feature input{features.length !== 1 ? "s" : ""} via Linear Regression
              </div>

              <div style={s.featureList}>
                <div style={s.featureListTitle}>Features used</div>
                {features.map((f) => (
                  <div key={f} style={s.featureRow}>
                    <span style={s.featureName}>{f}</span>
                    <span style={s.featureVal}>{inputs[f] != null ? Number(inputs[f]).toLocaleString() : "—"}</span>
                  </div>
                ))}
              </div>

              <div style={s.disclaimer}>
                Prediction accuracy depends on dataset size and feature correlation. This is a baseline model.
              </div>
            </>
          ) : (
            <div style={s.resultEmpty}>
              <div style={s.resultEmptyIcon}><PlayIcon size={36} /></div>
              <div style={s.resultEmptyTitle}>Ready to predict</div>
              <div style={s.resultEmptyText}>
                Select a target column, fill in feature values, then click Run Prediction.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Local sub-components ──────────────────────────────────────────────────────
function PageHeader({ numericCount }) {
  return (
    <div style={s.header}>
      <div>
        <h1 style={s.headerTitle}>AutoML Predictions</h1>
        <p style={s.headerSub}>Train a Linear Regression model and predict values instantly</p>
      </div>
      {numericCount > 0 && (
        <div style={s.headerBadge}>
          <span style={s.badgeDot} />{numericCount} numeric columns
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={s.sectionTitle}>{children}</div>;
}

function PlayIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PredictIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
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
    flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden",
  },
  headerTitle: { color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" },
  headerSub:   { color: "rgba(255,255,255,0.60)", fontSize: "var(--font-size-sm)", marginTop: 5 },
  headerBadge: {
    display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 16px",
    background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.30)",
    borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-cyan-light)",
  },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-cyan)", display: "inline-block" },
  layout:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" },
  card: {
    background: "white", borderRadius: "var(--border-radius-lg)", padding: 28,
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-md)", minHeight: 300,
  },
  sectionTitle: { fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-slate-900)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 18 },
  formGroup:    { marginBottom: 16 },
  label:  { display: "block", fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-600)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 },
  select: { width: "100%", padding: "10px 14px", border: "1.5px solid var(--color-slate-200)", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)", color: "var(--color-slate-800)", background: "white", outline: "none", cursor: "pointer" },
  input:  { width: "100%", padding: "10px 14px", border: "1.5px solid var(--color-slate-200)", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)", color: "var(--color-slate-800)", outline: "none", boxSizing: "border-box" },
  infoBox: { background: "var(--color-slate-50)", borderRadius: "var(--border-radius-md)", padding: "14px 16px", marginBottom: 20, border: "1px solid var(--color-slate-200)" },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  infoKey: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.06em" },
  infoVal: { fontSize: "var(--font-size-sm)", fontWeight: 600, color: "var(--color-slate-800)" },
  errorBox: { padding: "10px 14px", background: "var(--color-danger-bg)", color: "#991b1b", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 500, marginBottom: 16, border: "1px solid rgba(239,68,68,0.25)" },
  btn: {
    width: "100%", padding: 12, background: "var(--gradient-primary)", color: "white",
    border: "none", borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 700, fontFamily: "var(--font-family)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, boxShadow: "0 4px 14px rgba(29,78,216,0.30)", marginTop: 8,
  },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed", boxShadow: "none" },
  spinner: { display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.75s linear infinite" },
  resultLabel: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 },
  resultValue: { fontSize: 52, fontWeight: 800, color: "var(--color-royal)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 },
  resultSub:   { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", marginBottom: 24 },
  featureList: { background: "var(--color-slate-50)", borderRadius: "var(--border-radius-md)", padding: 16, marginBottom: 16, border: "1px solid var(--color-slate-200)" },
  featureListTitle: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 },
  featureRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  featureName: { fontSize: "var(--font-size-sm)", color: "var(--color-slate-700)", fontWeight: 500 },
  featureVal:  { fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-slate-900)" },
  disclaimer:  { fontSize: "var(--font-size-xs)", color: "var(--color-slate-400)", background: "var(--color-warning-bg)", padding: "10px 14px", borderRadius: "var(--border-radius-sm)", border: "1px solid rgba(245,158,11,0.20)" },
  resultEmpty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 260, textAlign: "center", gap: 16 },
  resultEmptyIcon:  { width: 72, height: 72, borderRadius: 20, background: "rgba(29,78,216,0.07)", color: "var(--color-royal)", display: "flex", alignItems: "center", justifyContent: "center" },
  resultEmptyTitle: { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-700)" },
  resultEmptyText:  { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", maxWidth: 280 },
  emptyState:  { textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "var(--border-radius-xl)", border: "1px solid var(--color-slate-200)" },
  emptyIcon:   { width: 72, height: 72, borderRadius: 20, background: "rgba(29,78,216,0.07)", color: "var(--color-royal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  emptyTitle:  { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-800)", marginBottom: 8 },
  emptyText:   { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)" },
};

export default Predictions;
