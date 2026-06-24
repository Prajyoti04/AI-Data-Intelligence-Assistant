import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ScatterPlotView({
  data,
  xColumn,
  yColumn,
}) {

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
      }}
    >
      <ResponsiveContainer>
        <ScatterChart>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey={xColumn}
            name={xColumn}
          />

          <YAxis
            dataKey={yColumn}
            name={yColumn}
          />

          <Tooltip />

          <Scatter
            data={data}
            fill="#EC4899"
          />

        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScatterPlotView;