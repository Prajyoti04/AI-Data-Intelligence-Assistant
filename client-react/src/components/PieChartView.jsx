import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";


const COLORS = [
  "#7C3AED",
  "#DB2777",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];


function PieChartView({ data }) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <PieChart width={650} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={140}
          innerRadius={60}
          paddingAngle={4}
          label
          isAnimationActive={true}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={36}
        />
      </PieChart>
    </div>
  );
}

export default PieChartView;