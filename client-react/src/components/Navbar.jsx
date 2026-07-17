const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "visualizations",
    label: "Visualizations",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6"  y1="20" x2="6"  y2="14" />
        <line x1="2"  y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    id: "predictions",
    label: "Predictions",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: "cleaning",
    label: "Data Cleaning",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

function Navbar({ page, setPage }) {
  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div style={styles.brandName}>DataIntel AI</div>
          <div style={styles.brandSub}>Analytics Platform</div>
        </div>
      </div>

      {/* Section label */}
      <div style={styles.sectionLabel}>NAVIGATION</div>

      {/* Nav items */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span style={{
                ...styles.navIcon,
                ...(isActive ? styles.navIconActive : {}),
              }}>
                {item.icon}
              </span>
              <span style={styles.navLabel}>{item.label}</span>
              {isActive && <span style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.sidebarFooter}>
        <div style={styles.footerCard}>
          <div style={styles.footerDot} />
          <div>
            <div style={styles.footerTitle}>System Online</div>
            <div style={styles.footerSub}>All services running</div>
          </div>
        </div>
        <div style={styles.footerVersion}>v2.0.0</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "var(--sidebar-width)",
    height: "100vh",
    background: "var(--gradient-sidebar)",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    zIndex: 100,
    overflowY: "auto",
    overflowX: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "8px",
  },
  brandIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563EB, #06B6D4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
  },
  brandName: {
    fontSize: "var(--font-size-md)",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-0.01em",
    lineHeight: "1.2",
  },
  brandSub: {
    fontSize: "var(--font-size-xs)",
    color: "rgba(255,255,255,0.45)",
    fontWeight: "500",
    marginTop: "2px",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.30)",
    letterSpacing: "0.10em",
    padding: "16px 20px 8px",
    textTransform: "uppercase",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "0 10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "11px 14px",
    background: "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.60)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "500",
    fontFamily: "var(--font-family)",
    transition: "all 0.18s ease",
    textAlign: "left",
    position: "relative",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.10)",
    color: "white",
    fontWeight: "600",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    opacity: 0.7,
    transition: "opacity 0.18s ease",
  },
  navIconActive: {
    opacity: 1,
    color: "var(--color-cyan-light)",
  },
  navLabel: {
    flex: 1,
  },
  activeIndicator: {
    position: "absolute",
    right: "10px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--color-cyan)",
    boxShadow: "0 0 6px var(--color-cyan)",
  },
  sidebarFooter: {
    padding: "16px 12px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: "auto",
  },
  footerCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "10px",
  },
  footerDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10B981",
    boxShadow: "0 0 6px #10B981",
    flexShrink: 0,
  },
  footerTitle: {
    fontSize: "var(--font-size-xs)",
    fontWeight: "600",
    color: "rgba(255,255,255,0.80)",
    lineHeight: "1.2",
  },
  footerSub: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.35)",
    marginTop: "2px",
  },
  footerVersion: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    textAlign: "center",
    letterSpacing: "0.05em",
  },
};

export default Navbar;
