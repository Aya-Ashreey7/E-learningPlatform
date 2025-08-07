// components/charts/PieChartComponent.jsx
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Programming", value: 400 },
  { name: "Design", value: 300 },
  { name: "Marketing", value: 200 },
  { name: "Business", value: 100 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function PieChartComponent() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
