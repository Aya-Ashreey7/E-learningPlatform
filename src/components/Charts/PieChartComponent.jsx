// components/charts/PieChartComponent.jsx
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#ff6699",
  "#33ccff",
  "#ff9933",
  "#99cc00",
  "#cc66ff",
  "#ff3366",
];

export default function PieChartComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "Categories"));
      const categories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id, // ID الكاتيجوري
        name: doc.data().name,
      }));

      const categoriesData = await Promise.all(
        categories.map(async (cat) => {
          // نعد الكورسات اللي عندها category_id = cat.id
          const coursesSnapshot = await getDocs(
            query(collection(db, "Courses"), where("category_id", "==", cat.id))
          );

          return {
            name: cat.name,
            value: coursesSnapshot.size || 0,
          };
        })
      );

      setData(categoriesData);
    };

    fetchCategoriesWithCounts();
  }, []);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={100}
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
