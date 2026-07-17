import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

const CustomTooltip = ({ active, payload, xColumn, yColumn }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.key}>{xColumn}</span>
        <span style={tooltipStyles.val}>{payload[0]?.value?.toLocaleString()}</span>
      </div>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.key}>{yColumn}</span>
        <span style={tooltipStyles.val}>{payload[1]?.value?.toLocaleString()}</span>
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
    minWidth: "140px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "4px",
  },
  key: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.50)",
    fontWeight: "600",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  val: {
    fontSize: "12px",
    fontWeight: "700",
    color: "white",
  },
};

function ScatterPlotView({ data, xColumn, yColumn }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: "center", color: "var(--color-slate-400)", padding: "40px 0" }}>No data available</div>;
  }

  return (
    <div style={{ width: "100%", height: "340px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-100)" />
          <XAxis
            dataKey={xColumn}
            name={xColumn}
            tick={{ fontSize: 11, fill: "var(--color-slate-500)", fontFamily: "var(--font-family)" }}
            axisLine={false}
            tickLine={false}
            label={{ value: xColumn, position: "insideBottom", offset: -4, fontSize: 12, fill: "var(--color-slate-500)" }}
          />
          <YAxis
            dataKey={yColumn}
            name={yColumn}
            tick={{ fontSize: 11, fill: "var(--color-slate-500)", fontFamily: "var(--font-family)" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <ZAxis range={[35, 35]} />
          <Tooltip
            content={<CustomTooltip xColumn={xColumn} yColumn={yColumn} />}
            cursor={{ strokeDasharray: "3 3", stroke: "var(--color-slate-300)" }}
          />
          <Scatter
            data={data}
            fill="#2563EB"
            fillOpacity={0.65}
            stroke="#1D4ED8"
            strokeWidth={1}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScatterPlotView;
