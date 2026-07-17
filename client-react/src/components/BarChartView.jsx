import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_COLORS = ["#2563EB", "#4F46E5", "#06B6D4", "#0EA5E9", "#6366F1", "#3B82F6", "#22D3EE", "#818CF8"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.label}>{label}</div>
      <div style={tooltipStyles.value}>
        <span style={tooltipStyles.dot} />
        {payload[0].value.toLocaleString()}
      </div>
    </div>
  );
};

const tooltipStyles = {
  box: {
    background: "var(--color-navy)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "10px 14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.30)",
  },
  label: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    marginBottom: "4px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "15px",
    fontWeight: "700",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--color-cyan)",
    display: "inline-block",
  },
};

function BarChartView({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: "center", color: "var(--color-slate-400)", padding: "40px 0" }}>No data available</div>;
  }

  return (
    <div style={{ width: "100%", height: "340px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-100)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--color-slate-500)", fontFamily: "var(--font-family)" }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-slate-500)", fontFamily: "var(--font-family)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(29,78,216,0.04)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52} animationDuration={900}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.92} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartView;
