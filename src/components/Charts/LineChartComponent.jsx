// src/components/LineChartComponent.jsx
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db } from "../../firebase";

export default function LineChartComponent() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = {};

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          if (user.createdAt) {
            const date = user.createdAt.toDate(); // لازم createdAt يكون Timestamp
            const month = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb"
            usersData[month] = (usersData[month] || 0) + 1;
          }
        });

        // نحول object لـ array
        const chartData = Object.keys(usersData).map((month) => ({
          name: month,
          users: usersData[month],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
