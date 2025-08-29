import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { db } from "../../firebase";

// Sample data showing number of bookings per month

export default function BarChartComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Orders"), (snapshot) => {
      const orders = snapshot.docs.map((doc) => doc.data());

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthlyBookings = new Array(12).fill(0);

      orders.forEach((order) => {
        if (order.createdAt) {
          const date = order.createdAt.toDate();
          const monthIndex = date.getMonth();
          monthlyBookings[monthIndex]++;
        }
      });

      const chartData = months.map((name, index) => ({
        name,
        bookings: monthlyBookings[index],
      }));

      setData(chartData);
    });

    return () => unsubscribe(); // دي بتنظف الـ listener لما الكومبوننت يتشال
  }, []);

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
