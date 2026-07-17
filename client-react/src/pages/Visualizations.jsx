import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import PieChartView      from "../components/PieChartView";
import BarChartView      from "../components/BarChartView";
import AIInsights        from "../components/AIInsights";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import ChatAssistant     from "../components/ChatAssistant";
import ScatterPlotView   from "../components/ScatterPlotView";

/**
 * Visualizations — lazy-loads the full dataset from the backend on first
 * mount (or when uploadId changes). All other data comes from context.
 *
 * WHY lazy load here instead of at upload time:
 *  - /upload stays fast (no large payload)
 *  - dataset rows are only needed by this page + DataCleaning
 *  - loadDataset() is idempotent — second call is a no-op if data is cached
 */
function Visualizations() {
  const ctx = useData();
  const {
    uploadId, columnNames, correlationMatrix, recommendedTask,
    dataset, datasetLoading, datasetError, loadDataset, stats,
  } = ctx;

  const [selectedColumn, setSelectedColumn] = useState("");
  const [scatterX, setScatterX]             = useState("");
  const [scatterY, setScatterY]             = useState("");
  const [activeTab, setActiveTab]           = useState("distribution");

  // ── TRACE ──
  console.log("[Visualizations] render — uploadId:", uploadId, "| dataset:", dataset?.length, "| loading:", datasetLoading, "| error:", datasetError);

  // Lazy-load the dataset when this page is first visited after an upload
  useEffect(() => {
    console.log("[Visualizations] useEffect fired — uploadId:", uploadId);
    if (uploadId) loadDataset(uploadId);
  }, [uploadId, loadDataset]);

  // Set sensible defaults for column selectors once data arrives
  const numericCols = dataset.length
    ? Object.keys(dataset[0]).filter((k) => typeof dataset[0][k] === "number")
    : [];

  useEffect(() => {
    if (columnNames.length && !selectedColumn) setSelectedColumn(columnNames[0]);
    if (numericCols.length >= 2) {
      if (!scatterX) setScatterX(numericCols[0]);
      if (!scatterY) setScatterY(numericCols[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnNames.length, numericCols.length]);

  // ── Empty / loading states ────────────────────────────────────────────────
  if (!uploadId) {
    return (
      <div style={s.page}>
        <Header />
        <EmptyState message="Upload a dataset on the Dashboard to generate charts." />
      </div>
    );
  }

  if (datasetLoading) {
    return (
      <div style={s.page}>
        <Header stats={stats} columnCount={columnNames.length} />
        <LoadingState message="Loading dataset for visualization…" />
      </div>
    );
  }

  if (datasetError) {
    return (
      <div style={s.page}>
        <Header stats={stats} columnCount={columnNames.length} />
        <ErrorState message={datasetError} />
      </div>
    );
  }

  if (!dataset.length) {
    return (
      <div style={s.page}>
        <Header stats={stats} columnCount={columnNames.length} />
        <EmptyState message="Dataset is empty or could not be loaded." />
      </div>
    );
  }

  // ── Build chart data ──────────────────────────────────────────────────────
  const counts = {};
  dataset.forEach((row) => {
    const v = row[selectedColumn] ?? "Unknown";
    counts[String(v)] = (counts[String(v)] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const barData   = [...chartData].sort((a, b) => b.value - a.value).slice(0, 12);

  const scatterData = scatterX && scatterY
    ? dataset
        .filter((r) => r[scatterX] != null && r[scatterY] != null)
        .slice(0, 500)
        .map((r) => ({ [scatterX]: r[scatterX], [scatterY]: r[scatterY] }))
    : [];

  const TABS = [
    { id: "distribution", label: "Distribution" },
    { id: "scatter",      label: "Scatter Plot" },
    { id: "correlation",  label: "Correlation"  },
    { id: "insights",     label: "AI Insights"  },
    { id: "assistant",    label: "Chat Assistant"},
  ];

  return (
    <div style={s.page}>
      <Header stats={stats} columnCount={columnNames.length} />

      {/* Column selector */}
      <div style={s.selectorCard}>
        <label style={s.selectorLabel}>Column for Distribution Charts</label>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          style={s.select}
        >
          {columnNames.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tab bar */}
      <div style={s.tabsBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "distribution" && (
        <div style={s.chartGrid}>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Pie Distribution</div>
            <div style={s.chartSub}>{selectedColumn}</div>
            <PieChartView data={chartData} />
          </div>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Top Categories</div>
            <div style={s.chartSub}>{selectedColumn} · top {barData.length}</div>
            <BarChartView data={barData} />
          </div>
        </div>
      )}

      {activeTab === "scatter" && (
        <div style={s.card}>
          <div style={s.chartTitle}>Scatter Plot</div>
          <div style={s.chartSub}>Numeric column comparison</div>
          {numericCols.length < 2 ? (
            <div style={s.inCard}>Need at least 2 numeric columns.</div>
          ) : (
            <>
              <div style={s.scatterControls}>
                <div style={s.controlGroup}>
                  <label style={s.controlLabel}>X Axis</label>
                  <select value={scatterX} onChange={(e) => setScatterX(e.target.value)} style={s.select}>
                    {numericCols.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.controlGroup}>
                  <label style={s.controlLabel}>Y Axis</label>
                  <select value={scatterY} onChange={(e) => setScatterY(e.target.value)} style={s.select}>
                    {numericCols.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <ScatterPlotView data={scatterData} xColumn={scatterX} yColumn={scatterY} />
            </>
          )}
        </div>
      )}

      {activeTab === "correlation" && (
        <div style={s.card}>
          <CorrelationHeatmap correlationMatrix={correlationMatrix} />
        </div>
      )}

      {activeTab === "insights" && (
        <div style={s.card}>
          <AIInsights />
        </div>
      )}

      {activeTab === "assistant" && (
        <div style={s.card}>
          <ChatAssistant />
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Header({ stats, columnCount }) {
  return (
    <div style={s.header}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={s.headerTitle}>Visualizations</h1>
        <p style={s.headerSub}>Interactive charts · Correlation analysis · AI insights</p>
      </div>
      {stats && (
        <div style={s.headerStats}>
          <div style={s.stat}>
            <span style={s.statVal}>{stats.rows.toLocaleString()}</span>
            <span style={s.statLabel}>Rows</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statVal}>{columnCount}</span>
            <span style={s.statLabel}>Columns</span>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={s.emptyState}>
      <div style={s.emptyIcon}>
        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6"  y1="20" x2="6"  y2="14" /><line x1="2"  y1="20" x2="22" y2="20" />
        </svg>
      </div>
      <div style={s.emptyTitle}>No data available</div>
      <div style={s.emptyText}>{message}</div>
    </div>
  );
}

function LoadingState({ message }) {
  return (
    <div style={s.emptyState}>
      <div style={s.spinner} />
      <div style={s.emptyTitle}>Loading…</div>
      <div style={s.emptyText}>{message}</div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div style={{ ...s.emptyState, background: "var(--color-danger-bg)" }}>
      <div style={s.emptyTitle}>Error</div>
      <div style={{ ...s.emptyText, color: "#991b1b" }}>{message}</div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { padding: 32, maxWidth: 1400 },
  header: {
    background: "linear-gradient(135deg,#0F1E3C 0%,#1E3A5F 40%,#1D4ED8 100%)",
    borderRadius: "var(--border-radius-xl)", padding: "28px 32px", marginBottom: 24,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden",
  },
  headerTitle: { color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" },
  headerSub:   { color: "rgba(255,255,255,0.60)", fontSize: "var(--font-size-sm)", marginTop: 5 },
  headerStats: {
    display: "flex", alignItems: "center", gap: 20,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "var(--border-radius-md)", padding: "12px 20px",
    zIndex: 1, position: "relative",
  },
  stat: { display: "flex", flexDirection: "column", alignItems: "center" },
  statVal:     { fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1 },
  statLabel:   { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 },
  statDivider: { width: 1, height: 32, background: "rgba(255,255,255,0.15)" },
  selectorCard: {
    background: "white", borderRadius: "var(--border-radius-md)", padding: "16px 20px",
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-sm)",
    marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
  },
  selectorLabel: { fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-slate-700)", whiteSpace: "nowrap" },
  select: {
    padding: "9px 14px", borderRadius: "var(--border-radius-md)",
    border: "1.5px solid var(--color-slate-200)",
    fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)",
    color: "var(--color-slate-800)", background: "white",
    outline: "none", minWidth: 180, cursor: "pointer",
  },
  tabsBar: {
    display: "flex", gap: 4, marginBottom: 20,
    background: "white", borderRadius: "var(--border-radius-md)", padding: 5,
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-sm)", flexWrap: "wrap",
  },
  tab: {
    padding: "8px 18px", borderRadius: 9, border: "none", background: "transparent",
    color: "var(--color-slate-500)", fontSize: "var(--font-size-sm)", fontWeight: 600,
    fontFamily: "var(--font-family)", cursor: "pointer", transition: "all 0.18s ease", whiteSpace: "nowrap",
  },
  tabActive: { background: "var(--gradient-primary)", color: "white", boxShadow: "0 3px 10px rgba(29,78,216,0.25)" },
  chartGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  chartCard: {
    background: "white", borderRadius: "var(--border-radius-lg)", padding: 24,
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-md)",
  },
  card: {
    background: "white", borderRadius: "var(--border-radius-lg)", padding: 24,
    border: "1px solid var(--color-slate-200)", boxShadow: "var(--shadow-md)",
  },
  chartTitle: { fontSize: "var(--font-size-md)", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: 4 },
  chartSub:   { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", marginBottom: 16 },
  scatterControls: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  controlGroup: { display: "flex", flexDirection: "column", gap: 6, flex: "1 1 160px" },
  controlLabel: { fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-slate-600)", textTransform: "uppercase", letterSpacing: "0.06em" },
  emptyState: {
    textAlign: "center", padding: "80px 40px",
    background: "white", borderRadius: "var(--border-radius-xl)",
    border: "1px solid var(--color-slate-200)",
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 20,
    background: "rgba(29,78,216,0.07)", color: "var(--color-royal)",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
  },
  emptyTitle: { fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-slate-800)", marginBottom: 8 },
  emptyText:  { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)" },
  spinner: {
    width: 40, height: 40, margin: "0 auto 20px",
    border: "4px solid var(--color-slate-200)", borderTop: "4px solid var(--color-royal)",
    borderRadius: "50%", animation: "spin 0.75s linear infinite",
  },
  inCard: { textAlign: "center", color: "var(--color-slate-400)", padding: "40px 0", fontSize: "var(--font-size-sm)" },
};

export default Visualizations;
