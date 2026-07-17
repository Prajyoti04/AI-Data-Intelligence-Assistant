import { useState, useRef } from "react";
import { useData } from "../context/DataContext";

/**
 * UploadBox — reads uploadFile() from context directly.
 * No props needed for state management. The stale-closure bug in the old
 * useCallback(fn, []) is gone because we call context.uploadFile() which
 * lives in the provider and always has fresh references.
 */
function UploadBox() {
  const { uploadFile, uploading, uploadError, uploadId, reset } = useData();

  const [isDragging, setIsDragging]         = useState(false);
  const [progress, setProgress]             = useState(0);
  const [uploadSuccess, setUploadSuccess]   = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) return;   // UploadBox shows format badges; error comes from apiService

    setUploadSuccess(false);
    setUploadedFileName(file.name);
    setProgress(10);

    // Tick the progress bar while the real request is in-flight
    const timer = setInterval(() => setProgress((p) => Math.min(p + 10, 85)), 300);

    const id = await uploadFile(file);   // writes into context; returns upload_id or null

    clearInterval(timer);
    if (id) {
      setProgress(100);
      setUploadSuccess(true);
    } else {
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setUploadSuccess(false);
    setUploadedFileName("");
    setProgress(0);
    reset();                              // clears context state for a fresh upload
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.cardHeader}>
        <div>
          <div style={s.cardTitle}>Upload Dataset</div>
          <div style={s.cardSub}>CSV or Excel · Max 50 MB</div>
        </div>
        <span style={s.badge}>
          <span style={s.badgeDot} />
          Ready
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload dataset file"
        style={{
          ...s.dropZone,
          ...(isDragging    ? s.dropZoneActive  : {}),
          ...(uploadSuccess ? s.dropZoneSuccess : {}),
          cursor: uploading ? "default" : "pointer",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFile(e.target.files[0])}
          hidden
          aria-hidden="true"
        />

        {/* Icon */}
        <div style={{
          ...s.icon,
          background: uploadSuccess
            ? "linear-gradient(135deg,#10B981,#059669)"
            : isDragging ? "var(--gradient-primary)"
            : "linear-gradient(135deg,#1E3A5F,#1D4ED8)",
          transform: isDragging ? "scale(1.08)" : "scale(1)",
        }}>
          {uploadSuccess ? <CheckIcon /> : uploading ? <SpinnerIcon /> : <UploadIcon />}
        </div>

        {/* Body text */}
        {uploadSuccess ? (
          <div style={s.bodyBlock}>
            <div style={{ ...s.mainLabel, color: "var(--color-success)" }}>Upload Successful</div>
            <div style={s.subLabel}>{uploadedFileName}</div>
            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} style={s.resetBtn}>
              Upload another file
            </button>
          </div>
        ) : uploading ? (
          <div style={{ ...s.bodyBlock, width: "100%", maxWidth: 300 }}>
            <div style={s.mainLabel}>Processing dataset…</div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>
            <div style={s.progressPct}>{progress}%</div>
          </div>
        ) : (
          <div style={s.bodyBlock}>
            <div style={s.mainLabel}>
              {isDragging ? "Drop your file here" : "Drag & drop your dataset"}
            </div>
            <div style={s.subLabel}>or click to browse files</div>
            <div style={s.formats}>
              {[".CSV", ".XLSX", ".XLS"].map((f) => (
                <span key={f} style={s.formatBadge}>{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error banner — sourced from context so it's always fresh */}
      {uploadError && (
        <div style={s.errorBox} role="alert">
          <ErrorIcon />
          {uploadError}
        </div>
      )}
    </div>
  );
}

// ── Inline SVG icons ────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CheckIcon = () => (
  <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SpinnerIcon = () => <div style={s.spinnerInner} />;

const ErrorIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Styles ──────────────────────────────────────────────────────────────────
const s = {
  wrapper: {
    background: "white",
    borderRadius: "var(--border-radius-xl)",
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--color-slate-200)",
    overflow: "hidden",
    marginBottom: 28,
  },
  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px 0",
  },
  cardTitle: { fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-slate-900)" },
  cardSub:   { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", marginTop: 3 },
  badge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "4px 12px",
    background: "var(--color-success-bg)", color: "var(--color-success)",
    borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 700,
    border: "1px solid rgba(16,185,129,0.25)",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--color-success)", boxShadow: "0 0 5px var(--color-success)",
  },
  dropZone: {
    margin: "20px 24px 24px",
    border: "2px dashed var(--color-slate-200)",
    borderRadius: "var(--border-radius-lg)",
    padding: "40px 24px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    transition: "all 0.25s ease",
    background: "var(--color-slate-50)",
  },
  dropZoneActive: {
    borderColor: "var(--color-royal-light)",
    background: "rgba(29,78,216,0.04)",
    boxShadow: "0 0 0 4px rgba(37,99,235,0.08)",
  },
  dropZoneSuccess: { borderColor: "var(--color-success)", background: "var(--color-success-bg)" },
  icon: {
    width: 72, height: 72, borderRadius: 20,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 24px rgba(15,30,60,0.30)",
  },
  bodyBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", width: "100%" },
  mainLabel: { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-800)", letterSpacing: "-0.01em" },
  subLabel:  { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)" },
  formats:   { display: "flex", gap: 8, marginTop: 8 },
  formatBadge: {
    padding: "4px 10px",
    background: "rgba(29,78,216,0.08)", color: "var(--color-royal)",
    borderRadius: 6, fontSize: "var(--font-size-xs)", fontWeight: 700, letterSpacing: "0.05em",
  },
  progressBar:  { width: "100%", height: 8, background: "var(--color-slate-200)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--gradient-primary)", borderRadius: 4, transition: "width 0.3s ease" },
  progressPct:  { fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-royal)" },
  resetBtn: {
    marginTop: 6,
    background: "transparent", border: "1.5px solid var(--color-success)", color: "var(--color-success)",
    padding: "7px 18px", borderRadius: 8, cursor: "pointer",
    fontSize: "var(--font-size-sm)", fontWeight: 600, fontFamily: "var(--font-family)",
  },
  spinnerInner: {
    width: 28, height: 28,
    border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white",
    borderRadius: "50%", animation: "spin 0.75s linear infinite",
  },
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    margin: "0 24px 20px",
    padding: "12px 16px",
    background: "var(--color-danger-bg)", color: "#991b1b",
    borderRadius: "var(--border-radius-md)",
    fontSize: "var(--font-size-sm)", fontWeight: 500,
    border: "1px solid rgba(239,68,68,0.25)",
  },
};

export default UploadBox;
