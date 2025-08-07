import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Sample data showing number of bookings per month
const data = [
  { name: "January", bookings: 20 },
  { name: "February", bookings: 35 },
  { name: "March", bookings: 28 },
  { name: "April", bookings: 50 },
  { name: "May", bookings: 45 },
  { name: "June", bookings: 60 },
];

export default function BarChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="bookings" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
