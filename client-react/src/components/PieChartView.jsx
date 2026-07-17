import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#2563EB", "#06B6D4", "#4F46E5", "#0EA5E9", "#6366F1", "#22D3EE", "#3B82F6", "#818CF8"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.name}>{name}</div>
      <div style={tooltipStyles.value}>{value.toLocaleString()}</div>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700} fontFamily="var(--font-family)">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const tooltipStyles = {
  box: {
    background: "var(--color-navy)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "10px 16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.30)",
  },
  name: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  value: {
    fontSize: "15px",
    fontWeight: "700",
    color: "white",
  },
};

function PieChartView({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: "center", color: "var(--color-slate-400)", padding: "40px 0" }}>No data available</div>;
  }

  // Cap slices for readability
  const display = data.slice(0, 8);

  return (
    <div style={{ width: "100%", height: "340px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={display}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="46%"
            outerRadius={120}
            innerRadius={52}
            paddingAngle={3}
            labelLine={false}
            label={renderCustomLabel}
            animationDuration={900}
          >
            {display.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: "11px",
              fontFamily: "var(--font-family)",
              color: "var(--color-slate-600)",
              paddingTop: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartView;
