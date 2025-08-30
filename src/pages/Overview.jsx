import {
  FiBookOpen,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import LineChartComponent from "../components/Charts/LineChartComponent";
import BarChartComponent from "../components/Charts/BarChartComponent";
import PieChartComponent from "../components/Charts/PieChartComponent";
import PaymentChartComponent from "../components/Charts/PaymentChartComponent";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Overview() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  // firebase
  useEffect(() => {
    const totalCourseDoc = onSnapshot(collection(db, "Courses"), (snapshot) => {
      setTotalCourses(snapshot.size);
    });
    const totalUsersDoc = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });
    const totalBookingDoc = onSnapshot(collection(db, "Orders"), (snapshot) => {
      setTotalBookings(snapshot.size);
    });
    return () => {
      totalCourseDoc();
      totalUsersDoc();
      totalBookingDoc();
    };
  }, []);

  return (
    <DashboardLayout>
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiBookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Courses</h3>
            <p className="text-2xl font-bold mt-1">{totalCourses}</p>
          </div>
        </div>

        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiUsers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold mt-1">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiCalendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Bookings</h3>
            <p className="text-2xl font-bold mt-1">{totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">User Growth Over Time</h3>
          <LineChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">Bookings Per Month</h3>
          <BarChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">
            Course Distribution by Category
          </h3>
          <PieChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">Payment Methods Used</h3>
          <PaymentChartComponent />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineClock className="text-[#071d49]" /> Recent Activity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FaBookOpen className="text-indigo-600" /> Latest Courses
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>React for Beginners</li>
                <li>Intro to Python</li>
                <li>UI/UX Design Basics</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BsFillPersonPlusFill className="text-green-600" /> New Users
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Sarah Ali joined 5 mins ago</li>
                <li>Ahmed Nabil joined 10 mins ago</li>
                <li>Aya Gamal joined 1 hour ago</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiCalendar className="text-yellow-600" /> Recent Bookings
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Ahmed booked "React for Beginners"</li>
                <li>Sarah booked "Python Intro"</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiMessageSquare className="text-purple-600" /> Latest Reviews
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>“Great course!” - Omar</li>
                <li>“Loved it!” - Salma</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
