const CARD_THEMES = {
  rows: {
    gradient: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
    shadow: "0 8px 24px rgba(29,78,216,0.25)",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  columns: {
    gradient: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
    shadow: "0 8px 24px rgba(79,70,229,0.25)",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
  missing_values: {
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    shadow: "0 8px 24px rgba(217,119,6,0.25)",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  duplicates: {
    gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    shadow: "0 8px 24px rgba(220,38,38,0.25)",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="8" y="8" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
};

function MetricCard({ title, value }) {
  const key = title.toLowerCase().replace(/ /g, "_");
  const theme = CARD_THEMES[key] || CARD_THEMES.columns;

  return (
    <div style={styles.card}>
      {/* Top accent bar */}
      <div style={{ ...styles.accentBar, background: theme.gradient }} />

      <div style={styles.body}>
        <div style={styles.top}>
          <div>
            <div style={styles.title}>{title}</div>
            <div style={styles.value}>{value.toLocaleString()}</div>
          </div>
          <div style={{ ...styles.iconBox, background: theme.gradient, boxShadow: theme.shadow }}>
            {theme.icon}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "var(--border-radius-lg)",
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--color-slate-200)",
    overflow: "hidden",
    flex: 1,
    minWidth: "180px",
    transition: "all 0.25s ease",
    cursor: "default",
  },
  accentBar: {
    height: "4px",
    width: "100%",
  },
  body: {
    padding: "20px 22px 22px",
  },
  top: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  title: {
    fontSize: "var(--font-size-xs)",
    fontWeight: "700",
    color: "var(--color-slate-500)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "10px",
  },
  value: {
    fontSize: "32px",
    fontWeight: "800",
    color: "var(--color-slate-900)",
    lineHeight: "1",
    letterSpacing: "-0.02em",
  },
  iconBox: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
  },
};

export default MetricCard;
