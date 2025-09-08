// components/charts/PaymentChartComponent.jsx
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { db } from "../../firebase";

export default function PaymentChartComponent() {
  const [payment, setPayment] = useState([]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Orders"));
        const counts = {};

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const method = order.paymentMethod || "Unknown";
          counts[method] = (counts[method] || 0) + 1;
        });
        const chartData = Object.keys(counts).map((method) => ({
          method,
          value: counts[method],
        }));
        setPayment(chartData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPaymentData();
  }, []);
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart
          data={payment}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="method" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
